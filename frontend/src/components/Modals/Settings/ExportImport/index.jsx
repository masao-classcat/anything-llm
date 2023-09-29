import React, { useState, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle, Download, Loader, X } from "react-feather";
import System from "../../../../models/system";
import { API_BASE } from "../../../../utils/constants";
import paths from "../../../../utils/paths";

const noop = () => false;
export default function ExportOrImportData({ hideModal = noop }) {
  return (
    <div className="relative w-full w-full max-h-full">
      <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
        <div className="flex flex-col items-start justify-between px-6 py-4">
          <p className="text-gray-800 dark:text-stone-200 text-base ">
            複数の ClassCat&reg; Knowledge Manager インスタンスがありますか？
            それとも単にバックアップや別のインスタンスからデータを再インポートすることを望みますか？それをここで行なうことができます。
            <br />
            <b><i>
            これはベクトルデータベースの埋め込みを自動的に同期はしません！
            </i></b>
          </p>
          <a
            className="text-gray-400 dark:text-stone-500 my-2 text-xs"
            href={paths.exports()}
            target="_blank"
          >
            以前のエクスポートを見る &rarr;
          </a>
        </div>
        <div className="px-6 pb-6 space-y-6 flex h-full w-full">
          <div className="flex flex-col w-full gap-y-2">
            <ExportData />
            <div className="h-[1px] bg-slate-400 dark:bg-stone-600 w-full my-2" />
            <ImportData />
          </div>
        </div>
        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            onClick={hideModal}
            type="button"
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

function ExportData() {
  console.log('>> debug > ExportData (frontend/src/components/Modals/Settings/ExportImport/index.jsx)')

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const exportData = async function () {
    setLoading(true);
    const { filename, error } = await System.dataExport();
    setLoading(false);

    if (!filename) {
      setError(error);
    } else {
      setResult(filename);
      const link = document.createElement("a");
      link.href = `${API_BASE}/system/data-exports/${filename}`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-y-1 items-center px-6 py-4 border border-gray-200 rounded-lg dark:border-gray-600 bg-slate-200 group animate-pulse">
        <p className="text-gray-800 text-lg">エクスポート中....</p>
        <p className="text-gray-800 text-sm italic">
          ダウンロードは自動的に開始されます。
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <button
        type="button"
        onClick={() => setError(null)}
        className="w-full flex flex-col gap-y-1 items-center px-6 py-4 border border-red-200 rounded-lg dark:border-red-600 bg-red-200 group"
      >
        <p className="text-red-800 text-sm">{error}</p>
      </button>
    );
  }

  if (!!result) {
    return (
      <a
        target="_blank"
        href={`${API_BASE}/system/data-exports/${result}`}
        className="w-full flex gap-1 justify-center items-center px-6 py-4 border border-green-200 rounded-lg dark:border-green-600 bg-green-200 group"
      >
        <Download className="h-4 w-4 text-green-800 " />
        <p className="text-green-800 text-sm">データをダウンロードしてエクスポートします</p>
      </a>
    );
  }

  return (
    <button
      onClick={exportData}
      type="button"
      className="w-full flex  justify-center px-6 py-4 border border-gray-200 rounded-lg dark:border-gray-600 hover:bg-slate-200 group"
    >
      <p className="text-gray-800 dark:text-stone-200 group-hover:text-gray-800 text-lg">
        ClassCat&reg; Knowledge Manager データのエクスポート
      </p>
    </button>
  );
}

function ImportData() {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const startInput = () => inputRef?.current?.click();
  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);
    setFile(null);
    setResult(null);

    const file = e.target.files?.[0];
    if (!file) {
      setError("Invalid file upload");
      return false;
    }

    setFile(file);
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file, file.name);
    const { success, error } = await System.importData(formData);
    if (!success) {
      setError(error);
    } else {
      setResult(true);
    }

    setLoading(false);
    setFile(null);
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-y-1 items-center px-6 py-4 border border-gray-200 rounded-lg dark:border-gray-600 bg-slate-200 group animate-pulse">
        <p className="text-gray-800 text-lg">インポート中....</p>
        <p className="text-gray-800 text-sm italic">{file.name}</p>
      </div>
    );
  }

  if (error) {
    return (
      <button
        type="button"
        onClick={() => setError(null)}
        className="w-full flex flex-col gap-y-1 items-center px-6 py-4 border border-red-200 rounded-lg dark:border-red-600 bg-red-200 group"
      >
        <p className="text-red-800 text-sm">{error}</p>
      </button>
    );
  }

  if (!!result) {
    return (
      <div className="w-full flex flex-col gap-y-1 gap-1 justify-center items-center px-6 py-4 border border-green-200 rounded-lg dark:border-green-600 bg-green-200 group">
        <div className="flex items-center gap-x-1">
          <CheckCircle className="h-4 w-4 text-green-800 " />
          <p className="text-green-800 text-sm">
            インポートは正常に完了しました
          </p>
        </div>
        <p className="text-green-800 text-xs italic">
          インポートの結果を見るにはページを再ロードしてください。
        </p>
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        onChange={handleUpload}
        name="import"
        type="file"
        multiple="false"
        accept=".zip"
        hidden={true}
      />
      <button
        type="button"
        onClick={startInput}
        className="w-full flex flex-col gap-y-1 items-center px-6 py-4 border border-gray-200 rounded-lg dark:border-gray-600 hover:bg-slate-200 group"
      >
        <p className="text-gray-800 dark:text-stone-200 group-hover:text-gray-800 text-lg">
          ClassCat&reg; Knowledge Manager のデータをインポート
        </p>
        <p className="text-gray-800 dark:text-stone-200 group-hover:text-gray-800 text-xs italic">
          これは ClassCat&reg; Knowledge Manager インスタンスからのエクスポートである必要があります。
        </p>
      </button>
    </>
  );
}
