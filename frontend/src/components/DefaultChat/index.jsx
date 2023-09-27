import React, { useEffect, useState } from "react";
import { GitHub, GitMerge, Mail, Plus } from "react-feather";
import NewWorkspaceModal, {
  useNewWorkspaceModal,
} from "../Modals/NewWorkspace";
import paths from "../../utils/paths";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "../Sidebar";
import ChatBubble from "../ChatBubble";
import System from "../../models/system";

export default function DefaultChatContainer() {
  const [mockMsgs, setMockMessages] = useState([]);
  const [fetchedMessages, setFetchedMessages] = useState([]);
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();
  const popMsg = !window.localStorage.getItem("anythingllm_intro");

  useEffect(() => {
    const fetchData = async () => {
      const fetchedMessages = await System.getWelcomeMessages();
      setFetchedMessages(fetchedMessages);
    };
    fetchData();
  }, []);

  const MESSAGES = [
    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-start ${
          popMsg ? "chat__message" : ""
        }`}
      >
        <div className="p-4 max-w-full md:max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-b-2xl rounded-tr-2xl rounded-tl-sm">
          <p className="text-slate-800 dark:text-slate-200 font-[500] md:font-semibold text-sm md:text-base">
            ClassCat&reg; KBase Manager にようこそ。ClassCat KBase Manager は AnythingLLM をクラスキャットが日本語化しカスタマイズした製品です。
             AnythingLLM は Mintplex Labs によるオープンソースの AI ツールで
            <b>どのようなもの (anything)</b> でも訓練済みチャットボットに変換してそれで質問したりチャットできます。
            AnythingLLM は BYOK (Bring Your Own Keys) ソフトウェアですので、
            それとともに使用したいサービス以外で、このソフトウェアに対するサブスクリプション、料金、課金はありません。
          </p>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-start ${
          popMsg ? "chat__message" : ""
        }`}
      >
        <div className="p-4 max-w-full md:max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-b-2xl rounded-tr-2xl rounded-tl-sm">
          <p className="text-slate-800 dark:text-slate-200 font-[500] md:font-semibold text-sm md:text-base">
            AnythingLLM は、貴方の生産性を手間なく 100 倍向上させるために
            OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB そして他のサービスのような
            強力な AI 製品を整った素敵なパッケージに一つにまとめる最も簡単な方法です。
          </p>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-start ${
          popMsg ? "chat__message" : ""
        }`}
      >
        <div className="p-4 max-w-full md:max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-b-2xl rounded-tr-2xl rounded-tl-sm">
          <p className="text-slate-800 dark:text-slate-200 font-[500] md:font-semibold text-sm md:text-base">
            AnythingLLM はわずかな負荷で貴方のマシン上で完全にローカルで実行できます。
            貴方はそこにあることさえ気づかないでしょう！GPUは必要ありません。
            クラウドでもオンプレミスでもインストールが可能です。
            <br />
            AI ツールのエコシステムは日々強力になっています。AnythingLLM をその利用を簡単にします。
          </p>
          <a
            href={paths.github()}
            target="_blank"
            className="mt-4 w-fit flex flex-grow gap-x-2 py-[5px] px-4 border border-slate-400 rounded-lg text-slate-800 dark:text-slate-200 justify-start items-center hover:bg-slate-100 dark:hover:bg-stone-900 dark:bg-stone-900"
          >
            <GitMerge className="h-4 w-4" />
            <p className="text-slate-800 dark:text-slate-200 text-sm md:text-lg leading-loose">
              Github で issue を作成する
            </p>
          </a>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-end ${
          popMsg ? "chat__message" : ""
        }`}
      >
        <div className="p-4 max-w-full md:max-w-[75%] bg-slate-200 dark:bg-amber-800 rounded-b-2xl rounded-tl-2xl rounded-tr-sm">
          <p className="text-slate-800 dark:text-slate-200 font-[500] md:font-semibold text-sm md:text-base">
            どのように始めればよいでしょう？
          </p>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-start ${
          popMsg ? "chat__message" : ""
        }`}
      >
        <div className="p-4 max-w-full md:max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-b-2xl rounded-tr-2xl rounded-tl-sm">
          <p className="text-slate-800 dark:text-slate-200 font-[500] md:font-semibold text-sm md:text-base">
            簡単です。すべてのコレクションは{" "}「<b>ワークスペース</b>」と呼ばれるバケットに組み込まれます。
            ワークスペースはファイル、ドキュメント、画像、PDF やその他のファイルのバケットで、
            これらは  LLM が理解して会話で利用できるものに変換されます。
            <br />
            <br />
            ファイルはいつでも追加または削除できます。
          </p>
          <button
            onClick={showNewWsModal}
            className="mt-4 w-fit flex flex-grow gap-x-2 py-[5px] px-4 border border-slate-400 rounded-lg text-slate-800 dark:text-slate-200 justify-start items-center hover:bg-slate-100 dark:hover:bg-stone-900 dark:bg-stone-900"
          >
            <Plus className="h-4 w-4" />
            <p className="text-slate-800 dark:text-slate-200 text-sm md:text-lg leading-loose">
              貴方の最初のワークスペースを作成する
            </p>
          </button>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-end ${
          popMsg ? "chat__message" : ""
        }`}
      >
        <div className="p-4 max-w-full md:max-w-[75%] bg-slate-200 dark:bg-amber-800 rounded-b-2xl rounded-tl-2xl rounded-tr-sm">
          <p className="text-slate-800 dark:text-slate-200 font-[500] md:font-semibold text-sm md:text-base">
            これは AI ドロップボックスか何かのようなものですか？チャットについてはどうでしょう？チャットボックスですよね？
          </p>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-start ${
          popMsg ? "chat__message" : ""
        }`}
      >
        <div className="p-4 max-w-full md:max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-b-2xl rounded-tr-2xl rounded-tl-sm">
          <p className="text-slate-800 dark:text-slate-200 font-[500] md:font-semibold text-sm md:text-base">
            AnythingLLM は単なるスマートな Dropbox ではありません。
            <br />
            <br />
            AnythingLLM はデータと会話する 2 つの方法を提供します :
            <br />
            <br />
            <i>Query (クエリー) :</i> チャットはアクセス可能なワークスペース内のドキュメントで見つかったデータや推論を返します。
            ワークスペースにより多くのドキュメントを追加すればより賢くなります！
            <br />
            <br />
            <i>Conversational  (会話形式) :</i> ドキュメント + 進行中のチャット履歴の両方が同時に LLM 知識に貢献します。
            リアルタイムなテキストベースの情報の追加や、LLM が持つかもしれない誤解の修正に最適です。
            <br />
            <br />
            <i>チャットの途中で</i> いずれのモードも切り替えることができます。
          </p>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-end ${
          popMsg ? "chat__message" : ""
        }`}
      >
        <div className="p-4 max-w-full md:max-w-[75%] bg-slate-200 dark:bg-amber-800 rounded-b-2xl rounded-tl-2xl rounded-tr-sm">
          <p className="text-slate-800 dark:text-slate-200 font-[500] md:font-semibold text-sm md:text-base">
            なるほど。それは凄い、すぐに試してみましょう！
          </p>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-start ${
          popMsg ? "chat__message" : ""
        }`}
      >
        <div className="p-4 max-w-full md:max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-b-2xl rounded-tr-2xl rounded-tl-sm">
          <p className="text-slate-800 dark:text-slate-200 font-[500] md:font-semibold text-sm md:text-base">
            楽しんでください！
          </p>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4">
            <a
              href={paths.github()}
              target="_blank"
              className="mt-4 w-fit flex flex-grow gap-x-2 py-[5px] px-4 border border-slate-400 rounded-lg text-slate-800 dark:text-slate-200 justify-start items-center hover:bg-slate-100 dark:hover:bg-stone-900 dark:bg-stone-900"
            >
              <GitHub className="h-4 w-4" />
              <p className="text-slate-800 dark:text-slate-200 text-sm md:text-lg leading-loose">
                GitHub のスター
              </p>
            </a>
            <a
              href={paths.mailToClassCat()}
              className="mt-4 w-fit flex flex-grow gap-x-2 py-[5px] px-4 border border-slate-400 rounded-lg text-slate-800 dark:text-slate-200 justify-start items-center hover:bg-slate-100 dark:hover:bg-stone-900 dark:bg-stone-900"
            >
              <Mail className="h-4 w-4" />
              <p className="text-slate-800 dark:text-slate-200 text-sm md:text-lg leading-loose">
                クラスキャットにコンタクト
              </p>
            </a>
          </div>
        </div>
      </div>
    </React.Fragment>,
  ];

  useEffect(() => {
    function processMsgs() {
      if (!!window.localStorage.getItem("anythingllm_intro")) {
        setMockMessages([...MESSAGES]);
        return false;
      } else {
        setMockMessages([MESSAGES[0]]);
      }

      var timer = 500;
      var messages = [];

      MESSAGES.map((child) => {
        setTimeout(() => {
          setMockMessages([...messages, child]);
          messages.push(child);
        }, timer);
        timer += 2_500;
      });
      window.localStorage.setItem("anythingllm_intro", 1);
    }

    processMsgs();
  }, []);

  return (
    <div
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
      className="transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-white dark:bg-black-900 md:min-w-[82%] p-[18px] h-full overflow-y-scroll"
    >
      {isMobile && <SidebarMobileHeader />}
      {fetchedMessages.length === 0
        ? mockMsgs.map((content, i) => {
            return <React.Fragment key={i}>{content}</React.Fragment>;
          })
        : fetchedMessages.map((fetchedMessage, i) => {
            return (
              <React.Fragment key={i}>
                <ChatBubble
                  message={
                    fetchedMessage.user === ""
                      ? fetchedMessage.response
                      : fetchedMessage.user
                  }
                  type={fetchedMessage.user === "" ? "response" : "user"}
                  popMsg={popMsg}
                />
              </React.Fragment>
            );
          })}
      {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
    </div>
  );
}
