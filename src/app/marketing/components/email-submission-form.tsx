"use client";

import React, { useEffect, useRef, useState } from "react";
import SetupModal from "@/app/utils/wakatime-setup/setup-modal";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import Icon from "@hackclub/icons";
import Modal from "../../../components/ui/modal";
import {
  handleEmailSubmission,
  markArrpheusReadyToInvite,
} from "../marketing-utils";
import { sendInviteJob } from "../invite-job";

export default function EmailSubmissionForm() {
  const [email, setEmail] = useState<string>();
  const [wakaKey, setWakaKey] = useState<string>();
  const [wakaUsername, setWakaUsername] = useState<string>();
  const [detectedInstall, setDetectedInstall] = useState<boolean>();
  const [personRecordId, setPersonRecordId] = useState<string>();
  const [errorText, setErrorText] = useState<string>();
  const [t, sT] = useState<Timer>();
  const formRef = useRef<HTMLFormElement>(null);

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
        }, 2_500),
      );
      return;
    } else if (!validEmail(emailStr)) {
      setErrorText("You need to enter a valid email.");
      sT(
        setTimeout(() => {
          setErrorText(undefined);
          formRef.current?.reset();
        }, 2_500),
      );
      return;
    }

    console.log({ email: emailStr, userAgent: navigator.userAgent });
    await sendInviteJob({
      email: emailStr,
      userAgent: navigator.userAgent,
    });
    setEmail(emailStr);
    // const hfsRes = await handleEmailSubmission(emailStr, mobile, ua);
    // if (!hfsRes) throw new Error("Failed to handle email submission");
    // const { username, key, personRecordId } = hfsRes;
    // console.log("Handled email submission with res:", {
    //   username,
    //   key,
    //   personRecordId,
    // });
    // setWakaKey(key);
    // setWakaUsername(username);
    // setPersonRecordId(personRecordId);
    // setEmail(emailStr);
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

      <Modal isOpen={email} close={() => setEmail(null)}>
        <p className="text-xl mb-4">
          We can't wait for you to join High Seas! We're under heavy demand
          right now, so your invite won't come until later. Hang tight and we'll
          see you soon!
        </p>
        <img src="/party-orpheus.svg" />
      </Modal>

      {/* {wakaKey && wakaUsername ? (
        <SetupModal
          isOpen={email && personRecordId}
          close={() => {
            setDetectedInstall(true);
            setEmail(null);
            setWakaKey(null);
            setWakaUsername(null);
            markArrpheusReadyToInvite(personRecordId);
          }}
          onHbDetect={() => {
            setDetectedInstall(true);

            // TODO: Sort this shit out
            setEmail(null);
            setWakaKey(null);
            setWakaUsername(null);
            markArrpheusReadyToInvite(personRecordId);
          }}
          wakaKey={wakaKey}
          wakaUsername={wakaUsername}
        />
      ) : null} */}

      {/* <Modal isOpen={detectedInstall} close={() => setDetectedInstall(false)}>
        <p className="text-3xl mb-2">Check your email!</p>
        <p>You should see an invite to the Hack Club Slack.</p>

        {navigator.userAgent.toLowerCase().includes("mobile") ? (
          <p>
            <br />
            This next step <i>can</i> be done on your phone, but we strongly
            recommend doing it on whatever computer you use to code!
          </p>
        ) : null}

        <img
          src="/party-orpheus.svg"
          alt="a partying dinosaur"
          className="mt-8 mx-auto w-1/2"
        />

        <Button onClick={() => setDetectedInstall(false)} className="ml-auto">
          Dismiss
        </Button>
      </Modal> */}
    </>
  );
}

export const validEmail = (email: string): boolean =>
  !!String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
