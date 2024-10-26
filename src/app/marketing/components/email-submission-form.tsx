"use client";
import { useEffect, useRef, useState } from "react";
import {
  handleEmailSubmission,
  markArrpheusReadyToInvite,
} from "../marketing-utils";
import WakatimeSetupTutorialModal from "@/app/harbour/tabs/wakatime-setup-tutorial-modal";
import JSConfetti from "js-confetti";

export default function EmailSubmissionForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [wakaKey, setWakaKey] = useState(null);
  const [personRecId, setPersonRecId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const confettiRef = useRef<JSConfetti | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submissionTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    confettiRef.current = new JSConfetti();

    // Cleanup timeout on unmount
    return () => {
      if (submissionTimeoutRef.current) {
        clearTimeout(submissionTimeoutRef.current);
      }
    };
  }, []);

  const triggerConfetti = () => {
    confettiRef.current?.addConfetti({
      emojis: ["🌟", "✨", "💫", "🎉"],
      emojiSize: 50,
      confettiNumber: 50,
    });
  };

  const handleForm = async (formData: FormData) => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    console.log("running handleForm");

    setIsSubmitting(true);

    try {
      const email = formData.get("email") as string;
      if (!email) throw new Error("No email submitted!");
      formRef.current?.reset();

      setIsOpen(true);

      const { created, apiKey, personRecordId, username } =
        await handleEmailSubmission(email);
      console.log("Waka account response:", {
        created,
        apiKey,
        personRecordId,
        username,
      });

      setPersonRecId(personRecordId);
      setWakaKey(apiKey);
    } catch (error) {
      console.error("Error submitting email:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueFromModal = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    console.log("running handleContinueFromModal");
    setIsSubmitting(true);

    try {
      if (!personRecId) throw new Error("No person record ID set yet!");

      await markArrpheusReadyToInvite(personRecId);
      triggerConfetti();
      setIsOpen(false);
    } catch (err) {
      console.error("Error while handling modal continue:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        ref={formRef}
        action={handleForm}
        className="flex flex-wrap text-xl md:text-xl justify-center items-center mx-4 rounded-xl border-[#3852CD] border-4 bg-[#3852CD]"
      >
        <input
          type="text"
          name="email"
          placeholder="name@email.com"
          className="p-4 rounded-lg text-md"
          disabled={isSubmitting}
        />
        <button
          disabled={isSubmitting}
          className="bg-[#3852CD] p-4 text-white text-2xl disabled:opacity-50"
        >
          {isSubmitting
            ? "Processing..."
            : "Get started + get free stickers! →"}
        </button>
      </form>
      {wakaKey && personRecId ? (
        <WakatimeSetupTutorialModal
          wakaKey={wakaKey}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isSubmitting={isSubmitting}
          handleContinueFromModal={handleContinueFromModal}
        />
      ) : null}
    </>
  );
}
