import { ReactNode } from "react";
import TextPage from "@/components/layouts/text-page";
import Logo from "@/components/logo";
import { NextPage } from "next";
import DateFormatter from "@/components/utils/date-formatter";

const COLORS = {
  1: "bg-green-50 border-green-300",
  2: "bg-amber-50 border-amber-300",
} as const;

const FOREGROUND_COLORS = {
  1: "text-green-700",
  2: "text-amber-700",
} as const;

const AMENDEMENTS = {
  1: new Date("2019-02-25"),
  2: new Date("2023-10-24"),
} as const;

const AmendmentDate = ({ set }: { set: keyof typeof COLORS }) => (
  <>
    <span className="sr-only">Amendment ratified in </span>
    <DateFormatter
      className="disambiguate text-xs font-semibold"
      format="year"
      dateString={AMENDEMENTS[set]}
    />
  </>
);

const Highlight = ({
  set = 1,
  children,
}: {
  children: ReactNode;
  set?: keyof typeof COLORS;
}) => (
  <em
    className={`-my-0.5 mx-0.5 rounded border px-0.5 py-0.5 not-italic ${COLORS[set]}`}
  >
    {children}
    <span className={`px-1 ${FOREGROUND_COLORS[set]}`}>
      <AmendmentDate set={set} />
    </span>
  </em>
);

const BlockHighlight = ({
  set = 1,
  children,
}: {
  children: ReactNode;
  set?: keyof typeof COLORS;
}) => (
  <div className={`rounded border-l-2 pl-2 pr-2 ${COLORS[set]}`}>
    {children}

    <div className={`-mt-7 pb-1 text-right ${FOREGROUND_COLORS[set]}`}>
      <AmendmentDate set={set} />
    </div>
  </div>
);

const Constitution: NextPage = () => (
  <TextPage title="Club Constitution">
    <p className="block-emphasis">
      The Secretary shall retain each member’s signed declaration.
    </p>
    <p>
      Amendments ratified at the EGM (
      <time dateTime="2019-02-25">25 Feb 2019</time>,{" "}
      <time dateTime="2019-06-04">4 Jun 2019</time>) are
      <Highlight>highlighted</Highlight>.
    </p>
    <p>
      Amendments ratified at the AGM on{" "}
      <time dateTime="2023-10-24">24 Oct 2023</time> are
      <Highlight set={2}>highlighted in a different colour</Highlight>.
    </p>
    <h2>1. Name</h2>
    <p>
      The club shall be known as the Sudbury Rowing Club hereinafter referred to
      as <strong>“the club”</strong>. The Club colours shall be Oxford Blue and
      White
    </p>
    <h2>2. Objectives</h2>
    <p>
      The object of the club is to provide facilities for and promote
      participation of the whole community in the sport of rowing.
    </p>
    <h2>3. Property of the Club</h2>
    <p>
      All freehold land and buildings belonging to the Club shall be vested in
      Trustees and held in trust for the members of the Club in accordance with
      the constitution of the Club. The Trustees shall deal with such property
      as the committee directs. Trustees shall be elected from time to time by
      simple majority vote in a General Meeting.
    </p>
    <h2>4. Membership</h2>
    <p>The club is an open membership club.</p>
    <h3>Classes of Membership</h3>
    <h4>Voting members </h4>
    <ol type="a">
      <li>
        Full Members (persons over the age of 18 years old):
        <ol type="i">
          <li>rowing</li> <li>non rowing</li>
        </ol>
      </li>
      <li>
        Family Members
        <br />
        The spouse and/or children, under 18, of a full member.
      </li>
      <li>
        Junior Members
        <br />
        Persons under the age of 18 years old on 1st September of the current
        rowing year (The rowing year running from 1st September to 31st August).
      </li>
    </ol>
    <h4>Non Voting members </h4>
    <ol type="a">
      <li>
        Part time student members
        <br />
        Those who only row part of the year either holiday or term
      </li>
      <li>
        Associate/Social (Friends of SRC)
        <br />
        Do not have access to or use of club boats or members training equipment
        (including boats) and do not have voting rights.
      </li>
    </ol>
    <h3>Election of Membership</h3>
    <p>
      Membership of the Club shall be open to anyone interested in the sport of
      rowing on application, regardless of sex, age, disability, ethnicity,
      nationality, sexual orientation, religion or other beliefs. However,
      limitation of membership according to available facilities is allowable on
      a non-discriminatory basis.
    </p>
    <p>
      The Club may have different classes of membership and subscription on a
      non-discriminatory and fair basis. The Club will keep subscriptions at
      levels that will not pose a significant obstacle to people participating.
    </p>
    <p>
      Applicants for membership and members renewing their membership, will
      abide by the Rules and Regulations of the Club, of British Rowing, and the
      sport of rowing.
    </p>
    <p>
      If it is considered by the Club committee that the granting or renewal of
      membership would be detrimental to the aims and objectives of the Club, by
      virtue of conduct or character likely to bring the Club or the sport of
      rowing into disrepute or for some other similar good cause, the Club
      committee shall be entitled to refuse or withdraw such membership. In
      doing so the committee shall provide full reasons for their decision, upon
      written request, and grant a right of appeal to the members.
    </p>
    <h3>Restriction</h3>
    <p>
      A person who has been expelled from, or refused membership of British
      Rowing, shall not be eligible for membership.
    </p>
    <h2>5. Subscription</h2>
    <p>
      The rates of subscription shall be determined by the members in General
      Meeting and shall be due on election and, thereafter, on or before 1st
      November in each year.
    </p>
    <h2>6. Cessation of Membership</h2>
    <p>
      Any member may resign by giving one month’s clear notice in writing to the
      Secretary; any fees already paid will not be refunded.
    </p>
    <p>
      Any member violating any of the rules or regulations of the Club or being
      adjudged guilty of unsatisfactory conduct may, by resolution of the
      Committee, be suspended or expelled. In doing this the committee shall
      provide full reasons for their decision, upon written request, and grant a
      right of appeal to the members.
    </p>
    <p>
      A member shall be deemed to have resigned from the Club if, after due
      notice in writing, they have not paid, or set up a direct debit by 1st
      January the annual subscription which became due on 1st November.
    </p>
    <h2>7. Equal Opportunities Policy</h2>
    <p>
      The Club will ensure that the talents and resources of all members are
      utilised to the full and that no member receives less favourable treatment
      on the grounds of gender, disability, marital status, creed, social class,
      ethnicity, age or sexual orientation.
    </p>
    <BlockHighlight>
      <h2>8. Codes of Conduct</h2>
      <p>
        The Club adopts the British Rowing Codes of Conduct, to which all
        members must adhere. Members will be required to sign a declaration to
        that effect.
      </p>
    </BlockHighlight>
    <BlockHighlight set={2}>
      <h2>9. Anti-Bullying Policy</h2>
      <p>
        The club adopts the British Rowing Anti-bullying Policy, and all members
        are required to behave with care and courtesy to others, in all
        circumstances and at all times.
      </p>
    </BlockHighlight>
    <h2>10. Grievance and Disciplinary Procedures</h2>
    <p>
      An individual or member with a complaint about treatment by the Club
      should set out their grievance, in the first instance to the Club
      Chairman. The Club will seek to deal with complaints in a fair and timely
      manner
      <Highlight set={2}>
        and will adopt and follow the British Rowing Grievance and Disciplinary
        Policy.
      </Highlight>
    </p>
    <h2>11. Child Protection Procedures</h2>
    <p>
      The Club accepts the policy and procedures relating to Child Protection
      and the protection of Vulnerable Adults, as set out by British Rowing, and
      requires all members to accept them as a condition of membership.
    </p>
    <h2>12. Safety</h2>
    <p>
      The club activities will comply with the Water Safety Code contained in
      the rules of British Rowing and the Water Safety Code Guidance Notes as
      published by British Rowing.
    </p>
    <p>
      The Committee shall appoint a member to act as Safety Adviser whose duty
      it will be to understand the requirements of the British Rowing Code of
      Practice for Water Safety and advise on their prominent display, their
      observation and their implementation at all times.
    </p>
    <h2>13. Club President</h2>
    <p>
      The incoming Mayor of Sudbury shall be invited each year to become the
      Club president. The Secretary shall send a letter to the Town Clerk each
      year with the invitation. Vice-Presidents will be elected annually at the
      A.G.M.
    </p>
    <h2>14. Disqualification from Holding Office</h2>
    <p>Only members entitled to vote are eligible to hold office.</p>
    <p>
      Any member who is under the age of 16 years, shall not be eligible for
      election to the Committee of the Club.
    </p>
    <h2>15. Committee</h2>
    <p>
      The Committee shall conduct the affairs of the Club as a whole and shall
      consist of a Chairman, Secretary, Treasurer, and other Officers and
      committee members as deemed necessary.
    </p>
    <BlockHighlight>
      <p>
        Nominations for the position of Chairman, Secretary, Treasurer, Captain
        and other officers shall be put forward by two other members, together
        with a signed personal statement, to the Secretary at least 8 days prior
        to a general meeting.
      </p>
      <p>
        The Secretary will publish all nominations and statements at least 7
        days prior to the meeting.
      </p>
      <p>
        Only when no nominations are received for a post 8 days prior to the
        meeting can nominations be presented at that meeting.
      </p>
    </BlockHighlight>
    <p>
      If required, the Committee shall elect a Vice-Chairman from among its
      number.
    </p>
    <BlockHighlight>
      <p>
        The term of office for Chairman, Secretary, Treasurer and Captain shall
        be for one year, and members shall be eligible for re-election in that
        current post for a maximum of five consecutive terms.
      </p>
      <p>
        The term of office for other offices shall be for one year, and members
        shall be eligible for re-election.
      </p>
    </BlockHighlight>
    <h2>16. Club Committee</h2>
    <p>
      The Committee is responsible for the general conduct of the Club’s
      business and activities.
    </p>
    <p>
      The Committee shall meet at regular intervals during the year, as required
      by the business to be transacted.
    </p>
    <p>
      Special meetings of the Committee shall be called by the Secretary on
      instructions from the Chairman, or not less than three committee members.
    </p>
    <p>
      A quorum shall consist of not less than 5 members. Two of whom must be
      identified under section 17.
    </p>
    <p>
      In the case of casual vacancy among the Committee, the remainder of the
      Committee shall be entitled to appoint another eligible person to act
      until the next AGM.
    </p>
    <h2>17. Duties of Committee</h2>
    <p>
      Chairman: The Chairman (or Chair) will preside at all General meetings of
      the Club and at all meetings of the Committee, and shall be responsible
      for guiding the activities of the club in accordance with its general
      policy as expressed by the majority of its members. The Chairman shall
      represent or arrange for the representation of the Club at British Rowing
      regional level and at meetings of other organisations. The Chairman shall
      ex officio be a member of any other committee of the Club.
    </p>
    <p>
      Captain: The Captain will be responsible for training, coaching and
      representation of the Club in competitions.
    </p>
    <p>
      Secretary: The Secretary will be responsible for the organisation of
      meetings of the Committee and of the Club, and the recording of minutes
      relating to such meetings and all correspondence relating to the general
      business of the Club.
    </p>
    <p>
      Treasurer: The Treasurer will be responsible for the collection and
      disbursement of all monies belonging to the Club and will keep proper
      accounting records of all such transactions. He or she will present to the
      members at the AGM a balance sheet and income and expenditure account
      showing the Club’s financial position and the results of its transactions
      for the year. The transactions of the Club will be conducted through a
      bank account and will require the signatures
      <Highlight>, or appropriate electronic authorisations</Highlight> of any 2
      of 3 members of the Committee who have been designated for the purpose.
    </p>
    <h2>18. Trustees</h2>
    <p>
      Trustees of the club shall be appointed, there being no less than 5, in
      whom the assets of the club i.e. land and property shall be invested.
      Their liability in law shall not extend further than the assets of the
      club from time to time invested in them. Trustees are:
    </p>
    <ul>
      <li>Adrian Ablitt</li>
      <li>Andrew Blit</li>
      <li>Patricia Fincham</li>
      <li>Antony Moule</li>
      <li>Simon White</li>
    </ul>
    <h2>19. General Meetings</h2>
    <p>
      An Annual General Meeting shall be held in the October of each year. There
      shall be laid before the meeting a statement of accounts made up to the
      30th September which immediately precedes the meeting.
    </p>
    <p>
      An Extraordinary General Meeting shall be called on the instructions of a
      simple majority of the Committee, or on a requisition signed by not less
      than 10% of the members of the Club entitled to vote.
    </p>
    <p>
      Not less than 21 days clear notice shall be given, specifying to all
      members the time and business of the General Meeting.
    </p>
    <p>
      Non-committee motions for discussion at Annual General Meetings, shall be
      lodged with the Secretary at least 30 days preceding the AGM, and be
      signed by 5 members entitled to vote.
    </p>
    <p>
      At any General Meeting, a resolution put to the vote of the Meeting shall
      be decided by a show of hands, of those entitled to vote, except when more
      than one nomination has been received for a position on the Committee, in
      which case voting will be by secret ballot.
    </p>
    <p>
      At all General Meetings the Chairman or President will preside or in
      his/her absence the voting members present shall elect a Chairman for the
      meeting.
    </p>
    <p>
      At all General Meetings not less than 20% of the members of the Club
      entitled to vote shall constitute a quorum.
    </p>
    <ol type="i">
      <li>
        Absences of Quorum
        <br />
        If after half an hour from the time appointed for the meeting, a quorum
        is not present, the Meeting, if called at the request of the members,
        shall be dissolved. In any other case, the Meeting shall be adjourned
        until a time and place to be fixed by the Committee. If a quorum is not
        present within half an hour from the time appointed for an Adjourned
        Meeting, the members present shall be a quorum.
      </li>
      <li>
        Accidental Omission
        <br />
        Accidental Omission to give notice of a meeting to, or the non-receipt
        of notice of, a meeting by any member shall not invalidate the
        proceedings of a meeting.
      </li>
    </ol>
    <h2>20. Liability</h2>
    <p>
      The General Committee shall manage the affairs of the Club. Financial or
      legal liability incurred in the rightful and proper exercise of their
      office shall not, however, be the personal liability of the Committee, but
      shall be the responsibility of the Club as a whole.
    </p>
    <h2>21. Alteration of Constitution</h2>
    <p>
      This constitution shall not be altered, amended or rescinded except by a
      General Meeting of the Club.
    </p>
    <p>
      A resolution to alter, amend or rescind the constitution must be passed by
      at least 75% of the members present at the General Meeting.
    </p>
    <h2>22. Auditor</h2>
    <p>
      Every Annual General Meeting shall appoint an Auditor who shall at the
      conclusion of the next financial year examine the accounting records of
      the Club, and report to the members on the income and expenditure accounts
      and balance sheet that are presented to the next AGM.
    </p>
    <h2>23. Distribution of Surplus Funds</h2>
    <p>
      In no circumstances can the club funds be distributed to members, and any
      profits earned shall be used in furthering the objects of the Club.
    </p>
    <h2>24. Termination</h2>
    <p>
      The Club shall not terminate except by a resolution of a Special General
      Meeting convened for the purpose and, in such an event, any surplus assets
      shall be handed over to another registered CASC, a registered charity or
      the sport’s governing body as agreed by the meeting which formally
      terminates the Club, for use by them in community-related sports.
    </p>
    <h2>25. Power of Decision</h2>
    <p>
      The Committee shall deal with any and all matters not provided for in this
      constitution, including its interpretation. The Committee’s decision in
      these matters shall be final.
    </p>
    <h2>26. Declaration</h2>
    <p>Each member upon joining shall sign the following declaration:</p>
    <div className="rounded border px-24 pb-12 font-serif text-xl text-black shadow-xl">
      <p className="flex justify-center">
        <Logo className="w-1/2" />
      </p>
      <p>
        Name: <span className="-mb-1 inline-block w-36 border-b border-black" />
      </p>
      <p>
        Upon acceptance into membership of the Sudbury Rowing Club I understand
        that rowing is undertaken at my own risk.
      </p>
      <p>
        I confirm that I do not suffer from any disability or medical condition
        which may render me unfit for strenuous exercise.
        <span className="px-px font-semibold">*</span>
      </p>
      <p>I also confirm that I am able to swim a minimum of 50 metres.</p>
      <p>
        Signed:{" "}
        <span className="-mb-1 inline-block w-36 border-b border-black" />
      </p>
      <p>
        Parent/Guardian (if under 18):{" "}
        <span className="-mb-1 inline-block w-36 border-b border-black" />
      </p>
      <div className="text-lg">
        <p>
          <span className="px-px font-semibold">*</span>
          <em>
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
  </TextPage>
);

export default Constitution;
