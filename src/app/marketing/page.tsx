import "./index.css";

import SignIn from "@/components/sign_in";
import HighSeas from "/public/logo.png";
import BackgroundImage from "/public/bg.png";
import Image from "next/image";

import how1 from "./art/how1.png";
import how2 from "./art/how2.png";
import how3 from "./art/how3.png";
import divider from "./art/divider.png";
import divider2 from "./art/divider2.png";
import paper from "./art/paper.png";

export default function Marketing() {
  return (
    <div>

<div className="bodycss">
      <div className="landing items-center">
        <div className="landing-left container">
          <p className="text-6xl lg:text-8xl uppercase">Low Skies</p>
          <div className="my-4 lg:text-3xl xl:text-4xl text-lg">
            <p className="">Hack Club's two week experiment</p>
            <p className="">Build stuff, battle others, get stuff!</p>
          </div>

          <div className="bg-green-400 p-2 inline-block w-80 rounded-lg linkPop">
            <a className="text-2xl text-white ml-3" href="#" target="_blank" rel="noopenner noreferrer">Enter the Thunderdome</a>
          </div>
          <p className="mt-2 max-w-72 lg:max-w-xl">
            Low Skies is free for teens to participate in, running Oct 2-16!
          </p>
        </div>
        <div className="landing-right"></div>
      </div>

      <Image src={divider} alt="Divider" className="mx-auto my-8 absolute xl:top-[75%] md:top-[80%] top-[90%] w-full" />

      <div className="md:my-44 my-24 xl:pb-24 lg:pb-[50px]">
        <div className="flex justify-center items-center mb-6">
          <p className="text-5xl text-center">How this works:</p>
        </div>
        <div className="flex flex-col justify-center items-center text-blue-900 mx-8">
          <div className="flex flex-wrap bg-white m-2 p-8 rounded-md pop">
            <div className="flex justify-center items-center w-full md:w-auto">
              <Image src={how1} alt="knight thinking of ideas"/>
            </div>
            <div className="flex flex-col justify-center items-center mt-8 md:mt-0 md:ml-8 w-full md:w-auto text-center">
              <p className="text-2xl mb-2">Make cool projects!</p>
              <p className="text-xl max-w-96">
                Create personal projects and track number of hours using {" "}
                <a href="https://waka.hackclub.com/" target="_blank" rel="noreferrer noopenner" className="bg-green-400 px-2 rounded-lg">Hackatime</a>!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap bg-white m-2 p-8 rounded-md pop">
            <div className="flex flex-col justify-center items-center mb-8 md:mb-0 md:mr-8 w-full md:w-auto text-center">
              <p className="text-2xl mb-2">Battle against other projects!</p>
              <p className="text-xl max-w-96">
                After finishing your project, submit it to the <a href="#" target="_blank" rel="noreferrer noopenner" className="bg-green-400 px-2 rounded-lg">Thunderdome</a>! Your project will battle others; winners get Scales!
              </p>
            </div>
            <div className="flex justify-center items-center w-full md:w-auto">
              <Image src={how2} alt="dragons battling"/>
            </div>
          </div>

          <div className="flex flex-wrap bg-white m-2 p-8 rounded-md pop">
            <div className="flex justify-center items-center w-full md:w-auto">
              <Image src={how3} alt="person shopping for items"/>
            </div>
            <div className="flex flex-col justify-center items-center mt-8 md:mt-0 md:ml-8 w-full md:w-auto text-center">
              <p className="text-2xl mb-2">Get free tools and swag!</p>
              <p className="text-xl max-w-96">
                At the <a href="#" target="_blank" rel="noreferrer noopenner" className="bg-green-400 px-2 rounded-lg">Shop</a>, you'll be able to spend your Scales on items of all sort, from notebooks to Flipper Zeros!
              </p>
            </div>
          </div>
        </div>

        <div className="relative xl:top-[75%] md:top-[80%] top-[90%]"><Image src={divider} alt="Divider" className="mx-auto my-8 absolute w-full" /></div>

        
      </div>

      <div className="bg-[#46C1FE] pt-12 xl:pt-24 mt-12 md:my-44 my-24 lg:pb-44 xl:pb-56 pb-24 sm:pb-36">
        <div className="my-12 lg:mt-24">
          <div className="flex justify-center items-center mb-8">
            <p className="text-5xl text-center mx-4">
              One battle at a time, what will you make?
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-8 lg:mx-24 2xl:mx-64 mt-10">
            <div className="bg-blue-500 p-8 rounded-lg md:col-span-2 pop">
              <p className="text-3xl">Build whatever you want!</p>
              <p className="my-4 text-lg">
                Any technical project counts. You could build an AR game, pixel
                art display, drawing robot, and more! After you're done your
                project, submit it to the Thunderdome! You earn Scales relative
                to how well they compete against other projects that took a
                similar time to make.
              </p>
              <p className="text-2xl">Don't know where to start?</p>
              <ul className="mt-4 mb-2 text-lg list-disc ml-8">
                <li><a href="https://boba.hackclub.com/" target="_blank" rel="noopenner noreferrer" className="aboutLink">Boba drops</a>: Build a site, get boba!</li>
                <li>
                  <a href="https://sprig.hackclub.com/" target="_blank" rel="noopenner noreferrer" className="aboutLink">Sprig</a>: Build a JS game, get your own console to play it on!
                </li>
                <li><a href="https://hackclub.com/onboard/" target="_blank" rel="noopenner noreferrer" className="aboutLink">OnBoard</a>: Design a PCB, get a $100 grant to get it built</li>
                <li><a href="https://blot.hackclub.com/" target="_blank" rel="noopenner noreferrer" className="aboutLink">Blot</a>: Write code. Make art. Get a drawing machine.</li>
                <li>
                  <a href="https://hackclub.com/bin/" target="_blank" rel="noopenner noreferrer" className="aboutLink">The Bin</a>: Build a circuit online, get the parts for free!
                </li>
              </ul>
            </div>

            <div className="bg-blue-500 p-8 rounded-lg pop">
              <p className="text-2xl">Not sure what to make?</p>
              <p className="text-lg my-4">Here are some projects Hack Clubbers made over the summer!</p>
            </div>
          </div>
        </div>

        <div className="my-24">
          <div className="flex flex-col justify-center items-center mb-8 m-5">
            <p className="text-5xl text-center mb-2">What's in stock?</p>
            <p className="text-xl text-center">
              Redeem these with your Scales! For high schoolers (or younger)
              only.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center">
            <div className="bg-green-400 p-6 rounded-lg m-4">
              <div className="bg-blue-400 w-64 h-72 mb-4 rounded-sm"></div>
              <p className="flex justify-center text-center text-3xl">
                name name
              </p>
            </div>
            <div className="bg-green-400 p-6 rounded-lg m-4">
              <div className="bg-blue-400 w-64 h-72 mb-4 rounded-sm"></div>
              <p className="flex justify-center text-center text-3xl">
                name name
              </p>
            </div>
            <div className="bg-green-400 p-6 rounded-lg m-4">
              <div className="bg-blue-400 w-64 h-72 mb-4 rounded-sm"></div>
              <p className="flex justify-center text-center text-3xl">
                name name
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center mt-8 m-10">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-400 rounded-lg p-4 linkPop"
            >
              <p className="text-3xl text-center">
                Check out the full list of items here!
              </p>
            </a>
          </div>
        </div>

        <div className="relative xl:top-[75%] md:top-[80%] top-[90%]"><Image src={divider} alt="Divider" className="mx-auto my-8 absolute w-full" /></div>
      </div>

      <div className="my-24">
        <div className="flex justify-center items-center mb-5">
          <p className="text-5xl text-center mt-12">FAQ</p>
        </div>
        <div>
          <Faq />
        </div>
      </div>

      <Image src={divider2} alt="Divider" className="mx-auto my-8 w-full" />

      <div className="flex flex-col justify-center items-center mt-12 mb-24">
        <p className="text-xl mb-2">So, what are you waiting for?</p>
        <button className="bg-green-400 p-4 text-4xl rounded-lg mx-8 linkPop"><a href="#">Enter the Thunderdome</a></button>
        <p className="text-xl mt-2">Build. Battle. Repeat.</p>
      </div>

      <div className="mb-24"></div>

      <div className="bg-blue-500 p-8">
        <p>this is a footer</p>
      </div>
    </div>






    {/*<div className="w-full h-full max-w-prose mx-auto">
      <Image
        className="-z-10 fixed inset-0 w-full h-full object-cover"
        src={BackgroundImage}
        alt=""
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
      <header className="w-fit mx-auto flex flex-col items-center gap-4">
        <Image
          src={HighSeas}
          alt="high seas"
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
        <h1 className="text-white text-2xl">Welcome to High Seas</h1>
      </header>

      <SignIn />

      <div className="text-white">
        <p>This is the signed out marketing page</p>
        <br />
        <p>
          Body body body body body body body body body body body body body body
          body body body body body body body body body body body body body body
          body body body body body body body body body body body body body body
          body body body body body body body body body body body body body body
          body body body body body body body body body body body body body body
          body body body body body body body body body body body body body body
          body
        </p>
      </div>
    </div> */}
    </div>
  );
}

interface FaqCardProps {
  question: string;
  answer: string;
}

const FaqCard: React.FC<FaqCardProps> = ({ question, answer }) => {
  return (
    <div>
      <div className="bg-blue-500 p-8 rounded-lg m-2 max-w-xl pop">
        <p className="mb-2 text-2xl">{question}</p>
        <p
          className=""
          dangerouslySetInnerHTML={{ __html: answer }}
        ></p>
      </div>
    </div>
  );
};

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  // Add your FAQ items here
];

const Faq: React.FC = () => {
  return (
    <div className="p-5 flex flex-wrap justify-center items-center">
      {faqData.map((item, index) => (
        <FaqCard key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};
