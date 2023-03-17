import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowsOutCardinal,
  Cursor,
  Eraser,
  FlowArrow,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Plus,
  TrashSimple,
  X,
} from "phosphor-react";
import { useCallback, useEffect, useState } from "react";
import AddCurriculumModal from "../components/Curriculum/AddCurriculumModal";
import Layout from "../components/Layout/Layout";
import { api } from "../utils/api";
import { useCurriculumStore } from "../utils/stores/curriculumStore";
import { useConstantsStore } from "../utils/stores/constantsStore";
import GridLayout from "react-grid-layout";
import "../../node_modules/react-grid-layout/css/styles.css";
import SemesterHeader from "../components/Curriculum/Semester/SemesterHeader";
import SemesterFooter from "../components/Curriculum/Semester/SemesterFooter";
import CourseItem from "../components/Curriculum/Course/CourseItem";
import CourseDetails from "../components/Curriculum/Course/CourseDetails";
import ConfirmActionModal from "../components/ConfirmActionModal";
import Connections from "../components/Curriculum/Connection/Connections";

const Home: NextPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [showNotice, setShowNotice] = useState(true);

  const [max, setMax] = useState(3);

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
    api.curriculum.createSemester.useMutation({
      onMutate: async () => {
        createSemester();
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
    if (sessionStatus === "authenticated") setShowNotice(false);
    setMax(
      ((curriculum?.courses
        .map((c) => c.position)
        .reduce((a, b) => (a > b ? a : b), 1) || 1) +
        2) *
        2
    );
    if (sessionStatus !== "loading" && (session?.user.id || "") !== userId) {
      setCurriculum(null);
      setUserId(session?.user.id || "");
    }
  }, [
    sessionStatus,
    setCurriculum,
    setUserId,
    userId,
    session?.user.id,
    curriculum?.courses,
    max,
  ]);

  const handleNewSem = () => {
    if (!curriculum) return;
    createSemesterMutation({
      id: curriculum.id,
    });
  };

  const tctx = api.useContext();
  const handleDeleteCurriculum = () => {
    if (!curriculum) return;
    deleteCurriculumMutation({ id: curriculum.id });
  };

  const semar = Array(curriculum?.sems || 0).fill(0);

  const setMode = useConstantsStore((state) => state.setMode);
  const mode = useConstantsStore((state) => state.mode);

  const [courseDeets, setCourseDeets] = useState<string>("");

  const moveCourse = useCurriculumStore((state) => state.moveCourse);
  const { mutate: moveCourseMutation } = api.course.moveCourse.useMutation({
    onMutate: async (input) => {
      moveCourse(input.id, input.sem, input.position);
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

  const [onConfirm, setOnConfirm] = useState<null | (() => void)>(null);

  const [prereq, setPrereq] = useState("");
  const [postreq, setPostreq] = useState("");

  const createConnection = useCurriculumStore(
    (state) => state.createConnection
  );
  const deleteConnection = useCurriculumStore(
    (state) => state.deleteConnection
  );

  const { mutate: createConnectionMutation } =
    api.connection.createConnection.useMutation({
      onMutate: async (input) => {
        createConnection({ ...input, createdAt: new Date() });
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

  const { mutate: deleteConnectionMutation } =
    api.connection.deleteConnection.useMutation({
      onMutate: async (input) => {
        deleteConnection(input.prereqId, input.postreqId);
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

  const handleCreateConnection = useCallback(
    (pre: string, post: string) => {
      if (!curriculum) return;
      createConnectionMutation({
        prereqId: pre,
        postreqId: post,
        curriculumId: curriculum.id,
      });
    },
    [createConnectionMutation, curriculum]
  );

  const handleDeleteConnection = () => {
    if (!curriculum) return;
    deleteConnectionMutation({
      prereqId: focused.slice(0, 24),
      postreqId: focused.slice(24),
    });
    setFocused("");
  };

  const [focused, setFocused] = useState("");

  const zoom = useConstantsStore((state) => state.zoom);
  const setZoom = useConstantsStore((state) => state.setZoom);
  const rowHeight = 36 * zoom;
  const colWidth = 192;

  return (
    <>
      <AddCurriculumModal
        newCurricOpen={newCurricOpen}
        setNewCurricOpen={setNewCurricOpen}
        title="new curriculum"
      />
      <ConfirmActionModal onConfirm={onConfirm} setOnConfirm={setOnConfirm} />
      {courseDeets && (
        <div
          onClick={() => setCourseDeets("")}
          className="fixed inset-0 z-[1]"
        />
      )}
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
                  create an account to access your curriculum from other devices
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
            <div className="flex justify-between border-b-2 border-zinc-200 px-4 py-2 dark:border-zinc-800">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleNewSem}
                  className="flex items-center gap-2 rounded bg-teal-600 px-2 py-1 text-zinc-100 transition hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 dark:bg-teal-400 dark:text-zinc-900"
                  disabled={!curriculum}
                >
                  <Plus size={16} weight="bold" />
                  new semester
                </button>
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => setZoom(zoom + 0.25)}
                    className="flex items-center gap-2 rounded-l bg-teal-600 px-2 py-1 text-zinc-100 transition hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 dark:bg-teal-400 dark:text-zinc-900"
                    disabled={!curriculum || zoom >= 2.0}
                  >
                    <MagnifyingGlassPlus size={16} weight="bold" />
                  </button>
                  <button
                    type="button"
                    className="flex w-12 items-center justify-center gap-2 bg-teal-600 px-2 py-1 text-zinc-100 transition hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 dark:bg-teal-400 dark:text-zinc-900"
                    disabled={!curriculum}
                  >
                    {zoom * 100}%
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom(zoom - 0.25)}
                    className="flex items-center gap-2 rounded-r bg-teal-600 px-2 py-1 text-zinc-100 transition hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 dark:bg-teal-400 dark:text-zinc-900"
                    disabled={!curriculum || zoom <= 0.25}
                  >
                    <MagnifyingGlassMinus size={16} weight="bold" />
                  </button>
                </div>
                <div className="flex">
                  <button type="button">
                    <input
                      type="radio"
                      className="peer hidden"
                      id="select"
                      name="mode"
                      defaultChecked
                      onChange={() => setMode("SELECT")}
                      disabled={!curriculum}
                    />
                    <label
                      htmlFor="select"
                      className="flex h-full items-center gap-2 rounded-l bg-teal-600 px-2 text-zinc-100 transition hover:brightness-110 peer-checked:brightness-125 peer-disabled:opacity-50 dark:bg-teal-400 dark:text-zinc-900"
                    >
                      <Cursor size={16} weight="bold" />
                    </label>
                  </button>
                  <button type="button">
                    <input
                      type="radio"
                      className="peer hidden"
                      id="move"
                      name="mode"
                      onChange={() => setMode("MOVE")}
                      disabled={!curriculum}
                    />
                    <label
                      htmlFor="move"
                      className="flex h-full items-center gap-2 bg-teal-600 px-2 text-zinc-100 transition hover:brightness-110 peer-checked:brightness-125 peer-disabled:opacity-50 peer-disabled:hover:brightness-100 dark:bg-teal-400 dark:text-zinc-900"
                    >
                      <ArrowsOutCardinal size={16} weight="bold" />
                    </label>
                  </button>
                  <button type="button">
                    <input
                      type="radio"
                      className="peer hidden"
                      id="connect"
                      name="mode"
                      onChange={() => setMode("CONNECT")}
                      disabled={!curriculum}
                    />
                    <label
                      htmlFor="connect"
                      className="flex h-full items-center gap-2 rounded-r bg-teal-600 px-2 text-zinc-100 transition hover:brightness-110 peer-checked:brightness-125 peer-disabled:opacity-50 peer-disabled:hover:brightness-100 dark:bg-teal-400 dark:text-zinc-900"
                    >
                      <FlowArrow size={16} weight="bold" />
                    </label>
                  </button>
                </div>
                {focused.length === 48 && (
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleDeleteConnection}
                    className="flex items-center gap-2 rounded bg-teal-600 px-2 py-1 text-zinc-100 transition hover:brightness-110 peer-disabled:opacity-50 peer-disabled:hover:brightness-100 dark:bg-teal-400 dark:text-zinc-900"
                  >
                    <Eraser size={16} weight="bold" />
                    delete connection
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOnConfirm(() => handleDeleteCurriculum)}
                  className="flex items-center gap-2 rounded bg-teal-600 px-2 py-1 text-zinc-100 transition hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 dark:bg-teal-400 dark:text-zinc-900"
                  disabled={!curriculum}
                >
                  <TrashSimple size={16} weight="bold" />
                  delete
                </button>
              </div>
            </div>
            {curriculum ? (
              <>
                <div className="relative flex flex-1 flex-col overflow-x-auto overflow-y-hidden">
                  <GridLayout
                    width={curriculum.sems * colWidth}
                    cols={curriculum.sems}
                    className={`layout`}
                    rowHeight={40}
                    style={{
                      width: curriculum.sems * colWidth,
                    }}
                    isResizable={false}
                    isDraggable={false}
                    margin={[0, 0]}
                  >
                    {semar.map((v, i) => (
                      <div
                        key={i}
                        className="group/sem z-10 border-b-2 border-r-2 border-zinc-200 px-2 dark:border-zinc-800"
                        data-grid={{
                          x: i,
                          y: 0,
                          w: 1,
                          h: 1,
                        }}
                      >
                        <SemesterHeader index={i} />
                      </div>
                    ))}
                  </GridLayout>
                  <GridLayout
                    width={curriculum.sems * colWidth}
                    cols={curriculum.sems}
                    className={`layout flex-1 overflow-visible bg-borderright from-transparent to-zinc-200 dark:to-zinc-800`}
                    rowHeight={rowHeight}
                    style={{
                      width: curriculum.sems * colWidth,
                      backgroundSize: colWidth,
                    }}
                    resizeHandles={[]}
                    compactType={null}
                    preventCollision={true}
                    autoSize={true}
                    // useCSSTransforms={false}
                    margin={[0, 0]}
                    isDraggable={mode === "MOVE"}
                    // onDrag={(l, o, n) => moveCourse(n.i, n.x, n.y)}
                    onDragStop={(l, o, n) =>
                      moveCourseMutation({ id: n.i, sem: n.x, position: n.y })
                    }
                    isBounded={true}
                  >
                    {curriculum.courses.map((course) => (
                      <div
                        className={
                          (course.id === courseDeets ? "z-20 " : "z-[3] ") +
                          (course.id === prereq || course.id === postreq
                            ? postreq
                              ? "bg-teal-500/25 "
                              : "bg-pink-500/25 "
                            : "bg-transparent ") +
                          "pointer-events-none flex items-center justify-center "
                        }
                        key={course.id}
                        data-grid={{
                          x: course.sem,
                          y: course.position,
                          w: 1,
                          h: 2,
                        }}
                      >
                        {courseDeets === course.id && (
                          <CourseDetails
                            course={course}
                            x={
                              (course.sem + 1) * colWidth + 256 >=
                                curriculum.sems * colWidth &&
                              curriculum.sems > 3
                                ? -256 - 12
                                : colWidth - 24 - 12
                            }
                            y={
                              course.position > 3
                                ? -colWidth + rowHeight * 0.75
                                : -rowHeight + rowHeight * 0.25
                            }
                            close={() => setCourseDeets("")}
                          />
                        )}
                        <CourseItem
                          focus={() => setFocused(course.id)}
                          blur={() => setFocused("")}
                          open={() => {
                            if (mode !== "SELECT") return;
                            setCourseDeets((prev) =>
                              prev === course.id ? "" : course.id
                            );
                          }}
                          mousedown={() => {
                            if (mode !== "CONNECT") return;
                            setPrereq(course.id);
                            document.addEventListener(
                              "mouseup",
                              () => {
                                setPrereq("");
                                setPostreq("");
                              },
                              { once: true }
                            );
                          }}
                          mouseup={() => {
                            if (mode !== "CONNECT") return;
                            if (prereq === course.id) return;
                            handleCreateConnection(prereq, course.id);
                          }}
                          mouseover={() => {
                            if (mode !== "CONNECT") return;
                            if (!prereq) return;
                            setPostreq(course.id);
                          }}
                          mouseout={() => {
                            if (mode !== "CONNECT") return;
                            if (!prereq) return;
                            setPostreq("");
                          }}
                          course={course}
                        />
                      </div>
                    ))}
                  </GridLayout>
                  <Connections
                    focused={focused}
                    setFocused={setFocused}
                    prereq={prereq}
                    postreq={postreq}
                  />
                  <GridLayout
                    width={curriculum.sems * colWidth}
                    cols={curriculum.sems}
                    className={`layout`}
                    rowHeight={40}
                    style={{
                      width: curriculum.sems * colWidth,
                    }}
                    isResizable={false}
                    isDraggable={false}
                    margin={[0, 0]}
                  >
                    {semar.map((v, i) => {
                      const units = curriculum.courses
                        .filter((c) => c.sem === i)
                        .reduce((a, { units }) => a + units, 0);
                      return (
                        <div
                          key={i}
                          className="z-10 border-t-2 border-r-2 border-zinc-200 bg-zinc-100/25 p-2 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900"
                          data-grid={{
                            x: i,
                            y: 0,
                            w: 1,
                            h: 1,
                          }}
                        >
                          <SemesterFooter units={units} />
                        </div>
                      );
                    })}
                  </GridLayout>
                </div>
              </>
            ) : (
              <div className="m-auto flex w-full max-w-[700px] flex-col items-center rounded-xl border-4 border-dashed border-zinc-200 py-5 dark:border-zinc-800">
                <div className="text-3xl">no curriculum</div>
                <div className="mb-2 text-lg text-zinc-600 dark:text-zinc-400">
                  create a new curriculum to start
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded bg-teal-600 px-2 py-1 text-zinc-100 transition hover:brightness-110 dark:bg-teal-400 dark:text-zinc-900"
                  onClick={() => setNewCurricOpen(true)}
                >
                  <Plus weight="bold" size={20} />
                  new curriculum
                </button>
              </div>
            )}
            <div className="flex border-t-2 border-zinc-200 px-4 py-2 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              curriculum units:{" "}
              {curriculum?.courses.reduce((a, { units }) => a + units, 0) ||
                "0"}
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default Home;
