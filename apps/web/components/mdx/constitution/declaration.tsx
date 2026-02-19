import { Wordmark } from "@sudburyrc/blue";

const DottedLine = () => (
  <span
    aria-hidden
    className="ml-2 flex grow border-gray-400 border-b-2 border-dotted"
  >
    &nbsp;
  </span>
);

export const Declaration = () => (
  <div className="rounded-sm px-6 py-8 text-black shadow-sm sm:px-28 sm:pt-14 sm:pb-24">
    <p className="flex justify-center">
      <Wordmark className="mb-5 w-1/2 text-blue-800" />
    </p>
    <p className="flex">
      Name: <DottedLine />
    </p>
    <p>
      Upon acceptance into membership of the Sudbury Rowing Club I understand
      that rowing is undertaken at my own risk.
    </p>
    <p>
      I confirm that I do not suffer from any disability or medical condition
      which may render me unfit for strenuous exercise.
      <span className="font-semibold">*</span>
    </p>
    <p>I also confirm that I am able to swim a minimum of 50&nbsp;metres.</p>
    <p className="flex">
      Signed: <DottedLine />
    </p>
    <p className="flex">
      Parent/Guardian (if under 18): <DottedLine />
    </p>

    <br className="mb-6" />

    <div className="text-gray-700 text-sm">
      <p>
        <em>
          <span className="font-semibold">*</span>
          Should a medical condition exist, this will not necessarily preclude
          you from membership/participation, but it must be declared.
        </em>
      </p>
      <p>
        <em>
          Should you be in any doubt, advice should be sought from your family
          doctor.
        </em>
      </p>
    </div>
  </div>
);
