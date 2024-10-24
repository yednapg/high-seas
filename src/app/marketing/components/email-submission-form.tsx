"use client";

import { useRef, useState } from "react";
import {
  handleEmailSubmission,
  markArrpheusReadyToInvite,
} from "../marketing-utils";
import WakatimeSetupTutorialModal from "@/app/harbour/tabs/wakatime-setup-tutorial-modal";

export default function EmailSubmissionForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [wakaKey, setWakaKey] = useState(null);
  const [personRecId, setPersonRecId] = useState(null);

  const formRef = useRef<HTMLFormElement>(null);

  const handleForm = async (formData: FormData) => {
    const email = formData.get("email") as string;
    if (!email) return;

    const { created, api_key, personRecordId } =
      await handleEmailSubmission(email);
    setPersonRecId(personRecordId);

    console.log("Waka account response:", { created, api_key, personRecordId });
    setWakaKey(api_key);

    setIsOpen(true);
    // formRef.current?.reset();
  };

  const handleContinueFromModal = async () => {
    // mark arrpheus_ready_to_invite true
    console.log("setting ", personRecId, "true in airtable perople");
    if (!personRecId) {
      alert("no person rec set yet!");
      return;
    }

    try {
      await markArrpheusReadyToInvite(personRecId);
    } catch (err) {
      console.log(
        "Couldn't mark arrpheus ready to invite on",
        personRecId,
        err,
      );
    }
  };

  return (
    <>
      <form
        ref={formRef}
        action={handleForm}
        className="flex flex-wrap text-xl md:text-xl mt-6 justify-center items-center mx-4 rounded-xl border-[#3852CD] border-4 bg-[#3852CD]"
      >
        <input
          type="text"
          name="email"
          placeholder="name@email.com"
          className="p-4 rounded-lg text-md"
        />
        <button className="bg-[#3852CD] p-4 text-white text-2xl">
          Get started + get free sticker!s →
        </button>
      </form>
      {wakaKey && personRecId ? (
        <WakatimeSetupTutorialModal
          wakaKey={wakaKey}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleContinueFromModal={handleContinueFromModal}
        />
      ) : null}
    </>
  );
}
