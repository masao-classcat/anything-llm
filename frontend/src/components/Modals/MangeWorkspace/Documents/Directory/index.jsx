import React, { useState } from "react";
import {
  FileMinus,
  FilePlus,
  Folder,
  FolderMinus,
  FolderPlus,
  Zap,
} from "react-feather";
import { nFormatter } from "../../../../../utils/numbers";
import System from "../../../../../models/system";

export default function Directory({
  files,
  parent = null,
  nested = 0,
  toggleSelection,
  isSelected,
}) {
  const [isExpanded, toggleExpanded] = useState(false);
  const [showDetails, toggleDetails] = useState(false);
  const [showZap, setShowZap] = useState(false);
  const handleDelete = async (name, meta) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this document?\nThis will require you to re-upload and re-embed it.\nThis document will be removed from any workspace that is currently referencing it.\nThis action is not reversible."
      )
    )
      return false;
    document?.getElementById(meta?.id)?.remove();
    await System.deleteDocument(name, meta);
  };

  if (files.type === "folder") {
    return (
      <div style={{ marginLeft: nested }} className="mb-2">
        <div
          className={`flex items-center hover:bg-gray-100 gap-x-2 text-gray-800 dark:text-stone-200 dark:hover:bg-stone-800 px-2 rounded-lg`}
        >
          {files.items.some((files) => files.type === "folder") ? (
            <Folder className="w-6 h-6" />
          ) : (
            <button onClick={() => toggleSelection(files.name)}>
              {isSelected(files.name) ? (
                <FolderMinus className="w-6 h-6 stroke-red-800 hover:fill-red-500" />
              ) : (
                <FolderPlus className="w-6 h-6 hover:stroke-green-800 hover:fill-green-500" />
              )}
            </button>
          )}

          <div
            className="flex gap-x-2 items-center  cursor-pointer w-full"
            onClick={() => toggleExpanded(!isExpanded)}
          >
            <h2 className="text-base md:text-2xl">{files.name}</h2>
            {files.items.some((files) => files.type === "folder") ? (
              <p className="text-xs italic">{files.items.length} フォルダ</p>
            ) : (
              <p className="text-xs italic">
                {files.items.length} ドキュメント |{" "}
                {nFormatter(
                  files.items.reduce((a, b) => a + b.token_count_estimate, 0)
                )}{" "}
                トークン
              </p>
            )}
          </div>
        </div>
        {isExpanded &&
          files.items.map((item) => (
            <Directory
              key={item.name}
              parent={files.name}
              files={item}
              nested={nested + 20}
              toggleSelection={toggleSelection}
              isSelected={isSelected}
            />
          ))}
      </div>
    );
  }

  const { name, type: _type, ...meta } = files;
  return (
    <div className="ml-[20px] my-2" id={meta.id}>
      <div className="flex items-center">
        {meta?.cached && (
          <button
            type="button"
            onClick={() => setShowZap(true)}
            className="rounded-full p-1 hover:bg-stone-500 hover:bg-opacity-75"
          >
            <Zap className="h-4 w-4 stroke-yellow-500 fill-yellow-400" />
          </button>
        )}
        {showZap && (
          <dialog
            open={true}
            style={{ zIndex: 100 }}
            className="fixed top-0 flex bg-black bg-opacity-50 w-[100vw] h-full items-center justify-center "
          >
            <div className="w-fit px-10 py-4 w-[25%] rounded-lg bg-white shadow dark:bg-stone-700 text-black dark:text-slate-200">
              <div className="flex flex-col w-full">
                <p className="font-semibold text-xl flex items-center gap-x-1 justify-left">
                  <Zap className="h-4 w-4 stroke-yellow-500 fill-yellow-400" />{" "}
                  は何を意味するのでしょう？
                </p>
                <p className="text-base mt-4">
                  この記号は、このドキュメントを前に埋め込んだことがあり、このドキュメントを再度埋め込むために料金を支払う必要がないことを示します。
                </p>
                <div className="flex w-full justify-center items-center mt-4">
                  <button
                    onClick={() => setShowZap(false)}
                    className="border border-gray-800 text-gray-800 hover:bg-gray-100 px-4 py-1 rounded-lg dark:text-slate-200 dark:border-slate-200 dark:hover:bg-stone-900"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </dialog>
        )}

        <div
          className={`flex items-center gap-x-2 text-gray-800 dark:text-stone-200 hover:bg-gray-100 dark:hover:bg-stone-800 px-2 rounded-lg`}
        >
          <button onClick={() => toggleSelection(`${parent}/${name}`)}>
            {isSelected(`${parent}/${name}`) ? (
              <FileMinus className="w-6 h-6 stroke-red-800 hover:fill-red-500" />
            ) : (
              <FilePlus className="w-6 h-6 hover:stroke-green-800 hover:fill-green-500" />
            )}
          </button>
          <div
            className="w-full items-center flex cursor-pointer"
            onClick={() => toggleDetails(!showDetails)}
          >
            <h3 className="text-sm">{name}</h3>
            <br />
          </div>
        </div>
      </div>
      {showDetails && (
        <div className="w-full flex flex-col">
          <div className="ml-[20px] flex flex-col gap-y-1 my-1 p-2 rounded-md bg-slate-200 font-mono text-sm overflow-x-scroll">
            {Object.entries(meta).map(([key, value], i) => {
              if (key === "cached") return null;
              return (
                <p key={i} className="whitespace-pre">
                  {key}: {value}
                </p>
              );
            })}
          </div>
          <div
            onClick={() => handleDelete(`${parent}/${name}`, meta)}
            className="flex items-center justify-end w-full"
          >
            <button className="text-sm text-slate-400 dark:text-stone-500 hover:text-red-500">
              Purge Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
