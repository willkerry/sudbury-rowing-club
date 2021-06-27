import Container from "./container";
import { Facebook, Twitter, Instagram } from "react-feather";
import Crest from "@/components/icons/logo/crest";

export default function Footer() {
  return (
    <footer className="bg-white border-t ">
      <Container>
        <div className="flex flex-wrap py-24 justify-left">
          <div className="w-1/2 sm:w-4/12 md:w-3/12">
            <Crest className="w-16 h-20 mb-6 text-gray-700" />
            <div className="space-y-1 text-sm text-gray-500">
              <p className="font-medium text-gray-800">Sudbury Rowing Club</p>
              <p>Quay Lane</p>
              <p>Sudbury</p>
              <p>CO10 2AN</p>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              <a className="transition hover:text-gray-900" href="/">
                Report a bug
              </a>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap pb-24 justify-left">
          <div className="w-1/2 sm:w-4/12 md:w-3/12">
            <div className="mb-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
              About
            </div>
            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              Introduction
            </a>
            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              History
            </a>
            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              Governance
            </a>
          </div>

          <div className="w-1/2 sm:w-4/12 md:w-3/12">
            <div className="mb-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
              Squads
            </div>
            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              Ladies
            </a>
            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              Men
            </a>
            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              Juniors
            </a>
          </div>

          <div className="w-1/2 sm:w-4/12 md:w-3/12">
            <div className="mb-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
              Regatta
            </div>

            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              About
            </a>
            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              Events
            </a>
            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              Entries
            </a>
            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              Course
            </a>
            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              Results
            </a>
          </div>

          <div className="w-1/2 sm:w-4/12 md:w-3/12">
            <div className="mb-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
              Community
            </div>
            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              myClubhouse
            </a>
            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              Facebook
            </a>
            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              Instagram
            </a>
            <a
              href="#"
              className="block my-3 text-sm font-medium text-gray-500 duration-700 hover:text-gray-700"
            >
              Twitter
            </a>
          </div>
        </div>
        <div className="pt-2">
          <div className="flex flex-col py-5 m-auto text-sm text-gray-400 md:flex-row">
            <div className="mt-2">© Sudbury Rowing Club 2021</div>

            <div className="flex flex-row mt-2 md:flex-auto md:flex-row-reverse">
              <a href="#" className="">
                <Facebook size={18} />
              </a>
              <a href="#" className="mr-4">
                <Twitter size={18} />
              </a>
              <a href="#" className="mr-4">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
