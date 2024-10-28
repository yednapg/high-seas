"use client";
import { useEffect, useRef, useState } from "react";
import WakatimeSetupTutorialModal from "@/app/harbor/tabs/wakatime-setup-tutorial-modal";

export default function EmailSubmissionForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submissionTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (submissionTimeoutRef.current) {
        clearTimeout(submissionTimeoutRef.current);
      }
    };
  }, []);

  const handleForm = async (formData: FormData) => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    const emailStr = formData.get("email") as string;
    if (!emailStr) {
      setIsSubmitting(false);
      alert("You need to input an email.");
      return;
    }

    setEmail(emailStr);
    setIsOpen(true);
    formRef.current?.reset();
  };

  return (
    <>
      <form
        ref={formRef}
        action={handleForm}
        className="flex flex-wrap text-xl md:text-xl justify-center items-center rounded-xl gap-2"
      >
        <input
          type="text"
          name="email"
          placeholder="name@email.com"
          className="p-4 rounded-lg text-md border-2 border-[#3852CD]"
          disabled={isSubmitting}
        />
        <button
          disabled={isSubmitting}
          className="p-4 text-white text-2xl disabled:opacity-50 bg-[#3852CD] rounded-xl"
        >
          {isSubmitting
            ? "Processing..."
            : "Get started →"}
        </button>
      </form>
      {email ? (
        <WakatimeSetupTutorialModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          email={email}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      ) : null}
    </>
  );
}
