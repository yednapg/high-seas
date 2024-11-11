"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import Icon from "@hackclub/icons";
import Modal from "../../../components/ui/modal";
import { handleEmailSubmission } from "../marketing-utils";
import { sendInviteJob } from "../invite-job";
import { usePlausible } from "next-plausible";

export default function EmailSubmissionForm() {
  const [email, setEmail] = useState<string>();
  const [errorText, setErrorText] = useState<string>();
  const [t, sT] = useState<Timer>();
  const formRef = useRef<HTMLFormElement>(null);
  const plausible = usePlausible();

  const handleForm = async (formData: FormData) => {
    const emailStr = (formData.get("email") as string).trim();

    if (t) {
      clearTimeout(t);
      sT(undefined);
    }

    if (!emailStr) {
      setErrorText("You need to enter an email.");
      sT(
        setTimeout(() => {
          setErrorText(undefined);
          formRef.current?.reset();
        }, 2_500)
      );
      return;
    }
    if (!validEmail(emailStr)) {
      setErrorText("You need to enter a valid email.");
      sT(
        setTimeout(() => {
          setErrorText(undefined);
          formRef.current?.reset();
        }, 2_500)
      );
      return;
    }

    const ua = navigator?.userAgent;
    const mobile = !!ua?.toLowerCase().includes("mobile");
    const urlParams = window?.location?.search || "";

    await Promise.all([
      handleEmailSubmission(emailStr, mobile, ua, urlParams),
      sendInviteJob({ email: emailStr, userAgent: ua }),
    ]);
    setEmail(emailStr);
    plausible("sign-up");
  };

  return (
    <>
      <div className="flex flex-col">
        <form
          ref={formRef}
          action={handleForm}
          className="flex flex-wrap text-xl md:text-xl justify-center items-center rounded-xl gap-2"
        >
          <input
            type="text"
            name="email"
            placeholder="name@email.com"
            className="px-6 py-2 rounded-lg text-md border-2 border-[#3852CD]"
          />
          <Button
            // disabled={buttonDisabled}
            className="px-6 py-2 text-2xl h-full disabled:opacity-50 bg-blues rounded-md text-white pop"
          >
            Get started <Icon glyph="enter" />
          </Button>
        </form>

        <AnimatePresence>
          {errorText ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "fit-content" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 border-2 border-[#3852CD] bg-blues px-4 py-2 rounded-md text-white"
            >
              {errorText}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <Modal isOpen={!!email} close={() => setEmail(undefined)}>
        <div
          className="flex flex-col gap-12"
          style={{ maxHeight: "75vh", overflowY: "auto" }}
        >
          <div className="space-y-4">
            <p className="text-3xl">Ahoy!</p>
            <p className="text-xl mb-4">
              We can't wait for you to join High Seas! We're under heavy demand
              right now, so it may take some time to get through the queue.
              <br />
              <br />
              <b>
                Look out for an email from Slack—<i>that's your ticket in!</i>{" "}
              </b>
              When it comes, we strongly recommend joining from the computer you
              code on.
              <br />
              <br />
              Hang tight and we'll see you soon 🏴‍☠️
            </p>
          </div>
          <img
            src="/party-orpheus.svg"
            className="w-1/2 mx-auto"
            alt="Party Orpheus"
          />
          <Button onClick={() => setEmail(undefined)}>Aye aye!</Button>
        </div>
      </Modal>
    </>
  );
}

export const validEmail = (email: string): boolean =>
  !!String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
