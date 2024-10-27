import JaggedCard from "@/components/jagged-card";
import Link from "next/link";
interface VerificationProps {
    status: string;
    reason: string;
}

const getVerificationMessage = (status: string, reason: string) => {
    switch (status) {
        default:
            return {
                color: "orange",
                message:
                    "You didn't verify yet. Please proceed to the verification flow.",
                redirect: true,
            };
        case "Unknown":
            return {
                color: "yellow",
                message:
                    "We are still working on verifying your age. Hang tight, it usually takes less than day!",
            };
        case "Insufficient":
            return {
                color: "orange",
                message: (
                    <>
                        Your verification was insufficient. Here's why, according to the reviewer {reason}. Fill out the form
                        again at{" "}
                        <Link href="https://forms.hackclub.com/eligibility" className="underline">
                            this link
                        </Link>
                        . Email{" "}
                        <a href="mailto:verifications@hackclub.com" className="underline">
                            verifications@hackclub.com
                        </a>{" "}
                        if you have any questions.
                    </>
                ),
            };
        case "Ineligible":
            return {
                color: "red",
                message: (
                    <>
                        High Seas is available only for teenagers. You were found to be an
                        adult, {reason}. Email{" "}
                        <a href="mailto:verifications@hackclub.com" className="underline">
                            verifications@hackclub.com
                        </a>{" "}
                        if you think this is a misunderstanding.
                    </>
                ),
            };
        case "Eligible L1":
        case "Eligible L2":
            return {
                color: "green",
                message: "You are verified and ready to ship projects!",
            };
        // case "Alum":
        //     return {
        //         color: "red",
        //         message: (
        //             <>
        //                 You graduated past the eligibility of this program. If you are within US/Canada and still in High School, fill the form with proof of your high school enrollment: <Link href="https://forms.hackclub.com/eligibilityt">this link</Link>.
        //             </>
        //         ),
        //     };
    }
};

export default function Verification({ status, reason }: VerificationProps) {
    const verificationStatus = status;
    const { color, message, redirect } = getVerificationMessage(
        verificationStatus,
        reason
    );

    return (
        <JaggedCard bgColor={color}>
            <div
                className={`py-1 px-3  ${
                    color === "yellow" || color === "orange" ? "text-black" : "text-white"
                }`}
            >
                <p>{message}</p>
                {redirect && (
                    <Link href="https://forms.hackclub.com/eligibility" className="underline">
                        Verify Yourself!
                    </Link>
                )}
            </div>
        </JaggedCard>
    );
}
