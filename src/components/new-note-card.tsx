import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export const NewNoteCard = ({ onNoteCreated }: NewNoteCardProps) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [shouldShowOnBoarding, setShouldShowOnBoarding] =
    useState<boolean>(true);
  const [content, setContent] = useState<string>("");

  const handleShouldShowOnBoarding = () => {
    setShouldShowOnBoarding(false);
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);

    if (event.target.value === "") setShouldShowOnBoarding(true);
  };

  const handleSaveNote = (event: FormEvent) => {
    event.preventDefault();

    if (content === "") return;

    onNoteCreated(content);
    setContent("");
    setShouldShowOnBoarding(true);
    toast.success("Nota criada com Sucesso");
  };

  const handleRecording = () => {
    const isSpeechRecognitionAPIAvaliable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvaliable) {
      alert("Infelizmente seu navegador não suporta a api de navegação.");
    }

    setShouldShowOnBoarding(false);
    setIsRecording(true);

    const speechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new speechRecognitionAPI();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setContent(transcription);
    };

    speechRecognition.onerror = (error) => {
      console.log(error);
    };

    speechRecognition.start();
  };

  const stopHandleRecording = () => {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md bg-slate-700 outline-none p-5 flex flex-col text-left gap-y-3 overflow-hidden hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar Nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertido em texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/60">
          <Dialog.Content className="fixed inset-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col overflow-hidden">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400">
              <X className="size-5 hover:text-slate-100" />
            </Dialog.Close>

            <form className="flex-1 flex flex-col">
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="text-sm font-medium text-slate-300">
                  Adicionar Nota
                </span>

                {shouldShowOnBoarding ? (
                  <p className="text-sm leading-6 text-slate-400">
                    Comece{" "}
                    <button
                      type="button"
                      className="text-lime-400 hover:underline"
                      onClick={handleRecording}
                    >
                      Gravando uma nota
                    </button>{" "}
                    em áudio ou se preferir{" "}
                    <button
                      type="button"
                      className="text-lime-400 hover:underline"
                      onClick={handleShouldShowOnBoarding}
                    >
                      utilize apenas texto.
                    </button>
                  </p>
                ) : (
                  <textarea
                    autoFocus
                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                    onChange={handleContentChange}
                    value={content}
                  />
                )}
              </div>

              {isRecording ? (
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-center text-sm text-slate-300 outline-none font-medium group p-4"
                  onClick={stopHandleRecording}
                >
                  <div className="size-3 rounded-full bg-red-500 animate-pulse"></div>
                  Gravando! (clique p/ interromper)
                </button>
              ) : (
                <button
                  type="button"
                  className="w-full bg-lime-500 text-center text-sm text-lime-950 outline-none font-medium group p-4"
                  onClick={handleSaveNote}
                >
                  Salvar Nota
                </button>
              )}
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
