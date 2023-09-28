import React, { useState, useEffect } from "react";
import System from "../../../../models/system";
import Workspace from "../../../../models/workspace";
import paths from "../../../../utils/paths";
import { useParams } from "react-router-dom";
import Directory from "./Directory";
import ConfirmationModal from "./ConfirmationModal";
import { AlertTriangle } from "react-feather";
import showToast from "../../../../utils/toast";

export default function DocumentSettings({ workspace }) {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [directories, setDirectories] = useState(null);
  const [originalDocuments, setOriginalDocuments] = useState([]);
  const [selectedFiles, setSelectFiles] = useState([]);
  const [hasFiles, setHasFiles] = useState(true);
  const [canDelete, setCanDelete] = useState(false);

  async function fetchKeys(refetchWorkspace = false) {
    const localFiles = await System.localFiles();
    const currentWorkspace = refetchWorkspace
      ? await Workspace.bySlug(slug)
      : workspace;
    const originalDocs =
      currentWorkspace.documents.map((doc) => doc.docpath) || [];
    const hasAnyFiles = localFiles.items.some(
      (folder) => folder?.items?.length > 0
    );

    const canDelete = await System.getCanDeleteWorkspaces();
    setCanDelete(canDelete);
    setDirectories(localFiles);
    setOriginalDocuments([...originalDocs]);
    setSelectFiles([...originalDocs]);
    setHasFiles(hasAnyFiles);
    setLoading(false);
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  const deleteWorkspace = async () => {
    if (
      !window.confirm(
        `You are about to delete your entire ${workspace.name} workspace. This will remove all vector embeddings on your vector database.\n\nThe original source files will remain untouched. This action is irreversible.`
      )
    )
      return false;
    await Workspace.delete(workspace.slug);
    workspace.slug === slug
      ? (window.location = paths.home())
      : window.location.reload();
  };

  const docChanges = () => {
    const changes = {
      adds: [],
      deletes: [],
    };

    selectedFiles.map((doc) => {
      const inOriginal = !!originalDocuments.find((oDoc) => oDoc === doc);
      if (!inOriginal) {
        changes.adds.push(doc);
      }
    });

    originalDocuments.map((doc) => {
      const selected = !!selectedFiles.find((oDoc) => oDoc === doc);
      if (!selected) {
        changes.deletes.push(doc);
      }
    });

    return changes;
  };

  const confirmChanges = (e) => {
    e.preventDefault();
    const changes = docChanges();
    changes.adds.length > 0 ? setShowConfirmation(true) : updateWorkspace(e);
  };

  const updateWorkspace = async (e) => {
    e.preventDefault();
    setSaving(true);
    showToast("ワークスペース更新中...", "info", { autoClose: false });
    setShowConfirmation(false);

    const changes = docChanges();
    await Workspace.modifyEmbeddings(workspace.slug, changes)
      .then((res) => {
        if (res && res.workspace) {
          showToast("ワークスペースの更新に成功しました。", "success", {
            clear: true,
          });
        } else {
          showToast("ワークスペースの更新に失敗しました。", "error", { clear: true });
        }
      })
      .catch((error) => {
        showToast(`ワークスペースの更新に失敗しました : ${error}`, "error", {
          clear: true,
        });
      });

    setSaving(false);
    await fetchKeys(true);
  };

  const isSelected = (filepath) => {
    const isFolder = !filepath.includes("/");
    return isFolder
      ? selectedFiles.some((doc) => doc.includes(filepath.split("/")[0]))
      : selectedFiles.some((doc) => doc.includes(filepath));
  };

  const toggleSelection = (filepath) => {
    const isFolder = !filepath.includes("/");
    const parent = isFolder ? filepath : filepath.split("/")[0];

    if (isSelected(filepath)) {
      const updatedDocs = isFolder
        ? selectedFiles.filter((doc) => !doc.includes(parent))
        : selectedFiles.filter((doc) => !doc.includes(filepath));
      setSelectFiles([...new Set(updatedDocs)]);
    } else {
      var newDocs = [];
      var parentDirs = directories.items.find((item) => item.name === parent);
      if (isFolder && parentDirs) {
        const folderItems = parentDirs.items;
        newDocs = folderItems.map((item) => parent + "/" + item.name);
      } else {
        newDocs = [filepath];
      }

      const combined = [...selectedFiles, ...newDocs];
      setSelectFiles([...new Set(combined)]);
    }
  };

  if (loading) {
    return (
      <>
        <div className="p-6 flex h-full w-full max-h-[80vh] overflow-y-scroll">
          <div className="flex flex-col gap-y-1 w-full">
            <p className="text-slate-200 dark:text-stone-300 text-center">
              ワークスペースをロードしています
            </p>
          </div>
        </div>
        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"></div>
      </>
    );
  }

  return (
    <>
      {showConfirmation && (
        <ConfirmationModal
          directories={directories}
          hideConfirm={() => setShowConfirmation(false)}
          additions={docChanges().adds}
          updateWorkspace={updateWorkspace}
        />
      )}
      <div className="p-6 flex h-full w-full max-h-[80vh] overflow-y-scroll">
        <div className="flex flex-col gap-y-1 w-full">
          {!hasFiles && (
            <div className="mb-4 w-full gap-x-2 rounded-lg h-10 border bg-orange-200 border-orange-800 dark:bg-orange-300 text-orange-800 flex  items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
              <p className="text-sm">
                アップロードされたファイルがありません。「ドキュメントのアップロード」タブからファイルをアップロードしてください。
              </p>
            </div>
          )}

          <div className="flex flex-col mb-2">
            <p className="text-gray-800 dark:text-stone-200 text-base ">
              ワークスペースに追加したり削除するフォルダを選択します。
            </p>
            <p className="text-gray-800 dark:text-stone-400 text-xs italic">
              選択されたワークスペース内に {selectedFiles.length} ドキュメント。
            </p>
          </div>
          <div className="w-full h-auto border border-slate-200 dark:border-stone-600 rounded-lg px-4 py-2">
            {!!directories && (
              <Directory
                files={directories}
                toggleSelection={toggleSelection}
                isSelected={isSelected}
              />
            )}
          </div>
        </div>
      </div>
      <div
        className={`flex items-center ${
          canDelete ? "justify-between" : "justify-end"
        } p-4 md:p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600`}
      >
        <button
          hidden={!canDelete}
          onClick={deleteWorkspace}
          type="button"
          className="border border-transparent text-gray-500 bg-white hover:bg-red-100 rounded-lg whitespace-nowrap text-sm font-medium px-5 py-2.5 hover:text-red-900 focus:z-10 dark:bg-transparent dark:text-gray-300 dark:hover:text-white dark:hover:bg-red-600"
        >
          ワークスペースの削除
        </button>

        <div className="flex items-center">
          <button
            disabled={saving}
            onClick={confirmChanges}
            type="submit"
            className="text-slate-200 bg-black-900 px-4 py-2 rounded-lg hover:bg-gray-900 whitespace-nowrap text-sm"
          >
            {saving ? "セーブ中..." : "変更の確認"}
          </button>
        </div>
      </div>
    </>
  );
}
