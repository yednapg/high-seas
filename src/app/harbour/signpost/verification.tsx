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
                    "You didn't verify yet. Please proceed to the verification flow. After all your galley won't sail on it's own!",
                redirect: true,
            };
        case "Unknown":
            return {
                color: "yellow",
                message:
                    "We've received your proof for verification! Hang tight, it usually takes less than day. If you installed HackaTime, work on your ship and blow us down!",
            };
        case "Insufficient":
            return {
                color: "orange",
                message: (
                    <>
                        Blimey! We weren't able to verify you with the proof you submitted According to the reviewer {reason}. 
                        Don't feed the fish though!  
                        {" "}
                        <Link href="https://forms.hackclub.com/eligibility" className="underline">
                            Try again here
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
                        Heave To!!! High Seas is available only for teenagers 18 and under. You were found to be an
                        adult. Email{" "}
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
                message: "Ahoy, Matey! Welcome aboard! Your verification has been approved. Become a Seadog and lookout for booty by shipping your projects! Let your ship become a Man-O-War!",
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
