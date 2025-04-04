import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { useEffect, useRef } from "react";
import { getUserConfig } from "./editor";
import "./App.css";

let timer: any;
const wrapper = new MonacoEditorLanguageClientWrapper();
export default function App() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    timer = setTimeout(async () => {
      await wrapper.init(getUserConfig());
      ref.current && wrapper.start(ref.current);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="App" style={{ height: "400px", width: "400px" }}>
      <div ref={ref} style={{ height: "100%" }}></div>
    </div>
  );
}
