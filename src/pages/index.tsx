import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { createId } from "@paralleldrive/cuid2";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowRight,
  Export,
  FlowArrow,
  Plus,
  TrashSimple,
  X,
} from "phosphor-react";
import { useEffect, useState } from "react";
import AddCurriculumModal from "../components/Curriculum/AddCurriculumModal";
import Semester from "../components/Curriculum/Semester";
import Layout from "../components/Layout/Layout";
import { api } from "../utils/api";
import { getPosition } from "../utils/position";
import { useCurriculumStore } from "../utils/stores/curriculumStore";

const Home: NextPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [showNotice, setShowNotice] = useState(false);

  const curriculum = useCurriculumStore((state) => state.curriculum);
  const setCurriculum = useCurriculumStore((state) => state.setCurriculum);

  const { isLoading: isCurriculumLoading } =
    api.curriculum.getCurriculum.useQuery(undefined, {
      onSuccess: (data) => {
        if (!data) return;
        setCurriculum(data);
      },
    });

  const createSemester = useCurriculumStore((state) => state.createSemester);

  const userId = useCurriculumStore((state) => state.userId);
  const setUserId = useCurriculumStore((state) => state.setUserId);

  const [newCurricOpen, setNewCurricOpen] = useState(false);

  const { mutate: deleteCurriculumMutation } =
    api.curriculum.deleteCurriculum.useMutation({
      onMutate: async () => {
        setCurriculum(null);
        await tctx.curriculum.getCurriculum.cancel();
        const prev = tctx.curriculum.getCurriculum.getData();
        tctx.curriculum.getCurriculum.setData(undefined, () => undefined);
        return { prev };
      },
      onError: (err, input, ctx) => {
        if (err.data?.code === "UNAUTHORIZED") return;
        tctx.curriculum.getCurriculum.setData(undefined, ctx?.prev);
      },
      onSettled: async () => {
        await tctx.curriculum.getCurriculum.refetch();
      },
    });

  let refetchTimeout: NodeJS.Timeout;
  const { mutate: createSemesterMutation } =
    api.semester.createSemester.useMutation({
      onMutate: async (input) => {
        createSemester({
          ...input,
          createdAt: new Date(),
          courses: [],
        });
        await tctx.curriculum.getCurriculum.cancel();
        const prev = tctx.curriculum.getCurriculum.getData();
        return { prev };
      },
      onError: (err, input, ctx) => {
        if (err.data?.code === "UNAUTHORIZED") return;
        tctx.curriculum.getCurriculum.setData(undefined, ctx?.prev);
      },
      onSettled: () => {
        // Cancel previous timeout, if any
        clearTimeout(refetchTimeout);

        // Set a new timeout to refetch after 500ms
        refetchTimeout = setTimeout(() => {
          async () => {
            await tctx.curriculum.getCurriculum.refetch();
          };
        }, 500); // adjust the delay time as needed
      },
    });

  useEffect(() => {
    if (sessionStatus === "unauthenticated") setShowNotice(true);

    if (sessionStatus !== "loading" && (session?.user.id || "") !== userId) {
      setCurriculum(null);
      setUserId(session?.user.id || "");
    }
  }, [sessionStatus, setCurriculum, setUserId, userId, session?.user.id]);

  const handleNewSem = () => {
    if (!curriculum) return;
    const lastsem = curriculum.sems.at(-1);
    if (!lastsem) {
      createSemesterMutation({
        id: createId(),
        curriculumId: curriculum.id,
        year: 1,
        sem: 1,
      });
      return;
    }
    createSemesterMutation({
      id: createId(),
      curriculumId: curriculum.id,
      year: Math.floor(lastsem.sem / 2 + lastsem.year),
      sem: (lastsem.sem % 2) + 1,
    });
  };

  const tctx = api.useContext();
  const handleDeleteCurriculum = () => {
    if (!curriculum) return;
    deleteCurriculumMutation({ id: curriculum.id });
  };
  const moveCourse = useCurriculumStore((state) => state.moveCourse);
  const { mutate: moveCourseMutation } = api.course.moveCourse.useMutation({
    onMutate: async (input) => {
      moveCourse(
        input.course,
        input.sourceIndex,
        input.sourceSemIndex,
        input.destinationSemIndex
      );
      await tctx.curriculum.getCurriculum.cancel();
      const prev = tctx.curriculum.getCurriculum.getData();
      return { prev };
    },
    onError: (err, input, ctx) => {
      if (err.data?.code === "UNAUTHORIZED") return;
      tctx.curriculum.getCurriculum.setData(undefined, ctx?.prev);
    },
    onSettled: () => {
      // Cancel previous timeout, if any
      clearTimeout(refetchTimeout);

      // Set a new timeout to refetch after 500ms
      refetchTimeout = setTimeout(() => {
        async () => {
          await tctx.curriculum.getCurriculum.refetch();
        };
      }, 500); // adjust the delay time as needed
    },
  });

  const handleDragEnd = (result: DropResult) => {
    if (!curriculum) return;
    if (!result.destination) return;
    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    )
      return;
    const sourceSemIndex = curriculum.sems.findIndex(
      (s) => s.id === result.source.droppableId
    );
    const destinationSemIndex = curriculum.sems.findIndex(
      (s) => s.id === result.destination?.droppableId
    );
    const sourceSem = curriculum.sems[sourceSemIndex];
    const destinationSem = curriculum.sems[destinationSemIndex];
    if (!sourceSem || !destinationSem) return;
    const sourceCourse = sourceSem.courses[result.source.index];
    if (!sourceCourse) return;
    sourceSem.courses.splice(result.source.index, 1);
    moveCourseMutation({
      course: {
        ...sourceCourse,
        position: getPosition(
          destinationSem.courses[result.destination.index - 1]?.position ||
            "aaa",
          destinationSem.courses[result.destination.index]?.position || "zzz"
        ),
        semesterId: result.destination.droppableId,
      },
      sourceIndex: result.source.index,
      sourceSemIndex: sourceSemIndex,
      destinationSemIndex: destinationSemIndex,
    });
  };

  return (
    <>
      <AddCurriculumModal
        newCurricOpen={newCurricOpen}
        setNewCurricOpen={setNewCurricOpen}
        title="new curriculum"
      />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Layout
          title="curriculum"
          description="list of all curriculum made by the user"
          crumbs="curriculum"
        >
          {isCurriculumLoading ? (
            <div className="grid h-full w-full place-items-center">
              <svg
                width="72"
                height="72"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-load fill-teal-600 dark:fill-teal-400"
              >
                <g clipPath="url(#clip0_0_1)">
                  <path d="M73.9142 77.9142L56.4142 60.4142C55.1543 59.1543 53 60.0466 53 61.8284V77.6716C53 78.202 53.2107 78.7107 53.5858 79.0858L71.0858 96.5858C72.3457 97.8457 74.5 96.9534 74.5 95.1716V79.3284C74.5 78.798 74.2893 78.2893 73.9142 77.9142Z" />
                  <path d="M22.0858 26.0858L39.5858 43.5858C40.8457 44.8457 39.9534 47 38.1716 47H22.3284C21.798 47 21.2893 46.7893 20.9142 46.4142L3.41422 28.9142C2.15429 27.6543 3.04662 25.5 4.82843 25.5L20.6716 25.5C21.202 25.5 21.7107 25.7107 22.0858 26.0858Z" />
                  <path d="M79.0858 53.5858L96.5858 71.0858C97.8457 72.3457 96.9534 74.5 95.1716 74.5H79.3284C78.798 74.5 78.2893 74.2893 77.9142 73.9142L60.4142 56.4142C59.1543 55.1543 60.0466 53 61.8284 53H77.6716C78.202 53 78.7107 53.2107 79.0858 53.5858Z" />
                  <path d="M79.0858 46.4142L96.5858 28.9142C97.8457 27.6543 96.9534 25.5 95.1716 25.5H79.3284C78.798 25.5 78.2893 25.7107 77.9142 26.0858L60.4142 43.5858C59.1543 44.8457 60.0466 47 61.8284 47H77.6716C78.202 47 78.7107 46.7893 79.0858 46.4142Z" />
                  <path d="M22.0858 73.9142L39.5858 56.4142C40.8457 55.1543 39.9534 53 38.1716 53H22.3284C21.798 53 21.2893 53.2107 20.9142 53.5858L3.41422 71.0858C2.15429 72.3457 3.04662 74.5 4.82843 74.5H20.6716C21.202 74.5 21.7107 74.2893 22.0858 73.9142Z" />
                  <path d="M26.0858 77.9142L43.5858 60.4142C44.8457 59.1543 47 60.0466 47 61.8284V77.6716C47 78.202 46.7893 78.7107 46.4142 79.0858L28.9142 96.5858C27.6543 97.8457 25.5 96.9534 25.5 95.1716V79.3284C25.5 78.798 25.7107 78.2893 26.0858 77.9142Z" />
                  <path d="M53.5858 20.9142L71.0858 3.41421C72.3457 2.15428 74.5 3.04662 74.5 4.82843V20.6716C74.5 21.202 74.2893 21.7107 73.9142 22.0858L56.4142 39.5858C55.1543 40.8457 53 39.9534 53 38.1716V22.3284C53 21.798 53.2107 21.2893 53.5858 20.9142Z" />
                  <path d="M46.4142 20.9142L28.9142 3.41421C27.6543 2.15428 25.5 3.04662 25.5 4.82843V20.6716C25.5 21.202 25.7107 21.7107 26.0858 22.0858L43.5858 39.5858C44.8457 40.8457 47 39.9534 47 38.1716V22.3284C47 21.798 46.7893 21.2893 46.4142 20.9142Z" />
                </g>
                <defs>
                  <clipPath id="clip0_0_1">
                    <rect width="100" height="100" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          ) : (
            <>
              {showNotice && (
                <div className="relative flex items-center justify-center bg-teal-600 p-2 text-sm text-zinc-100 dark:bg-teal-400 dark:text-zinc-900">
                  <Link
                    className="group flex gap-2 hover:underline"
                    href="sign-up"
                  >
                    create an account to access your curriculum from other
                    devices
                    <ArrowRight
                      className="transition group-hover:translate-x-2"
                      weight="bold"
                      size={20}
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowNotice(false)}
                    className="absolute right-4"
                  >
                    <X weight="bold" size={20} />
                  </button>
                </div>
              )}
              {curriculum ? (
                <>
                  <div className="flex justify-between px-4 pt-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleNewSem}
                        className="flex items-center gap-2 rounded bg-teal-600 px-2 py-1 text-zinc-100 transition hover:brightness-125 disabled:opacity-50 disabled:hover:brightness-100 dark:bg-teal-400 dark:text-zinc-900"
                      >
                        <Plus size={16} weight="bold" />
                        new semester
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-2 rounded bg-teal-600 px-2 py-1 text-zinc-100 transition hover:brightness-125 disabled:opacity-50 disabled:hover:brightness-100 dark:bg-teal-400 dark:text-zinc-900"
                      >
                        <FlowArrow size={16} weight="bold" />
                        connect prerequisites
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex items-center gap-2 rounded bg-teal-600 px-2 py-1 text-zinc-100 transition hover:brightness-125 disabled:opacity-50 disabled:hover:brightness-100 dark:bg-teal-400 dark:text-zinc-900"
                      >
                        <Export size={16} weight="bold" />
                        export
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteCurriculum}
                        className="flex items-center gap-2 rounded bg-teal-600 px-2 py-1 text-zinc-100 transition hover:brightness-125 disabled:opacity-50 disabled:hover:brightness-100 dark:bg-teal-400 dark:text-zinc-900"
                      >
                        <TrashSimple size={16} weight="bold" />
                        delete
                      </button>
                    </div>
                  </div>
                  <div className="relative flex flex-1 flex-col overflow-x-scroll">
                    <div className="flex h-full min-w-max flex-1 flex-nowrap px-4 pb-4 pt-2">
                      {curriculum.sems.length ? (
                        curriculum.sems.map((sem) => (
                          <Semester key={sem.id} sem={sem} />
                        ))
                      ) : (
                        <button
                          type="button"
                          onClick={handleNewSem}
                          className="flex h-full w-48 flex-col items-center justify-center border-y-2 border-l-2 border-dashed border-zinc-200 text-zinc-500 first:rounded-l-lg last:rounded-r-lg last:border-r-2 only:flex hover:border-teal-600 hover:text-teal-600 dark:border-zinc-800 hover:dark:border-teal-400 hover:dark:text-teal-400"
                        >
                          <Plus size={32} />
                          new sem
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex border-t-2 border-zinc-200 px-4 py-3 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                    total units:{" "}
                    {curriculum.sems
                      .map((s) =>
                        s.courses.map((c) => c.units).reduce((a, b) => a + b, 0)
                      )
                      .reduce((a, b) => a + b, 0)}
                  </div>
                </>
              ) : (
                <div className="m-auto flex w-full max-w-[700px] flex-col items-center rounded-xl border-4 border-dashed border-zinc-200 py-5 dark:border-zinc-800">
                  <div className="text-3xl">no curriculum</div>
                  <div className="mb-2 text-lg text-zinc-600 dark:text-zinc-400">
                    create a new curriculum to start planning
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded bg-teal-600 px-2 py-1 text-zinc-100 transition hover:brightness-125 dark:bg-teal-400 dark:text-zinc-900"
                    onClick={() => setNewCurricOpen(true)}
                  >
                    <Plus weight="bold" size={20} />
                    new curriculum
                  </button>
                </div>
              )}
            </>
          )}
        </Layout>
      </DragDropContext>
    </>
  );
};

export default Home;
