import Container from "./container";
import { Facebook, Twitter, Instagram } from "react-feather";
import Crest from "@/components/icons/logo/crest";

export default function Footer() {
  return (
    <footer className="bg-white border-t ">
      <Container>
        <div class="py-24 flex flex-wrap justify-left">
          <div class="w-1/2 sm:w-4/12 md:w-3/12">
            <Crest className="w-16 h-20 mb-6 text-gray-700" />
            <div className="space-y-1 text-sm text-gray-500">
              <p className="font-medium text-gray-800">Sudbury Rowing Club</p>
              <p>Quay Lane</p>
              <p>Sudbury</p>
              <p>CO10 2AN</p>
              
            </div><p className="mt-4 text-sm text-gray-500"><a className="transition hover:text-gray-900" href="/">Report a bug</a></p>
          </div>
        </div>
        <div class="pb-24 flex flex-wrap justify-left">
          <div class="w-1/2 sm:w-4/12 md:w-3/12">
            <div class="text-xs uppercase text-gray-400 font-bold tracking-widest mb-4">
              About
            </div>
            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              Introduction
            </a>
            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              History
            </a>
            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              Governance
            </a>
          </div>

          <div class="w-1/2 sm:w-4/12 md:w-3/12">
            <div class="text-xs uppercase text-gray-400 font-bold tracking-widest mb-4">
              Squads
            </div>
            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              Ladies
            </a>
            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              Men
            </a>
            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              Juniors
            </a>
          </div>

          <div class="w-1/2 sm:w-4/12 md:w-3/12">
            <div class="text-xs uppercase text-gray-400 font-bold tracking-widest mb-4">
              Regatta
            </div>

            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              About
            </a>
            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              Events
            </a>
            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              Entries
            </a>
            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              Course
            </a>
            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              Results
            </a>
          </div>

          <div class="w-1/2 sm:w-4/12 md:w-3/12">
            <div class="text-xs uppercase text-gray-400 font-bold tracking-widest mb-4">
              Community
            </div>
            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              myClubhouse
            </a>
            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              Facebook
            </a>
            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              Instagram
            </a>
            <a
              href="#"
              class="my-3 block text-gray-500 hover:text-gray-700 text-sm font-medium duration-700"
            >
              Twitter
            </a>
          </div>
        </div>
        <div class="pt-2">
          <div class="flex py-5 m-auto text-gray-400 text-sm flex-col md:flex-row">
            <div class="mt-2">© Sudbury Rowing Club 2021</div>

            <div class="md:flex-auto md:flex-row-reverse mt-2 flex-row flex">
              <a href="#" class="">
                <Facebook size={18} />
              </a>
              <a href="#" class="mr-4">
                <Twitter size={18} />
              </a>
              <a href="#" class="mr-4">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
