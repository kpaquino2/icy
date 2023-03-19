import { Switch } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../components/Forms/InputField";
import Layout from "../components/Layout/Layout";
import Button from "../components/UI/Button";
import { useSettingsStore } from "../utils/stores/settingsStore";

const generalschema = z.object({
  semcount: z.coerce
    .number({ invalid_type_error: "must be a number" })
    .int("must be an integer")
    .min(1, "can not be less than 1")
    .max(10, "try again with a smaller number"),
  yrstart: z.coerce
    .number({ invalid_type_error: "must be a number" })
    .int("must be an integer")
    .min(1, "can not be less than 1")
    .max(2100, "try again with a smaller number"),
  hasmidyear: z.boolean(),
});

const appearanceschema = z.object({
  dark: z.boolean(),
  animateConnections: z.boolean(),
});

type GeneralSchema = z.infer<typeof generalschema>;
type AppearanceSchema = z.infer<typeof appearanceschema>;

const Settings: NextPage = () => {
  const general = useSettingsStore((state) => state.general);
  const appearance = useSettingsStore((state) => state.appearance);

  const setGeneral = useSettingsStore((state) => state.setGeneral);
  const setAppearance = useSettingsStore((state) => state.setAppearance);

  const generalForm = useForm<GeneralSchema>({
    resolver: zodResolver(generalschema),
    defaultValues: general,
  });

  const hasmidyearController = useController({
    name: "hasmidyear",
    control: generalForm.control,
  });

  const appearanceForm = useForm<AppearanceSchema>({
    resolver: zodResolver(appearanceschema),
    defaultValues: appearance,
  });

  const darkController = useController({
    name: "dark",
    control: appearanceForm.control,
  });
  const animateConnectionsController = useController({
    name: "animateConnections",
    control: appearanceForm.control,
  });

  const saveGeneral = (data: GeneralSchema) => {
    setGeneral(data);
    generalForm.reset(data);
  };

  const saveAppearance = (data: AppearanceSchema) => {
    setAppearance(data);
    appearanceForm.reset(data);
  };

  return (
    <>
      <Layout title="settings" description="customize your settings with east">
        <div className="my-8 mx-auto w-[360px] md:w-[640px] lg:w-[768px] xl:w-[1024px]">
          <div className="text-xl font-thin">general</div>
          <div className="text-zinc-400 dark:text-zinc-600">
            curriculum preferences
          </div>
          <form
            onSubmit={generalForm.handleSubmit(saveGeneral)}
            className="my-6 rounded border-2 border-zinc-200 dark:border-zinc-800"
          >
            <div className="grid grid-cols-12 gap-y-2 p-8 md:gap-y-8">
              <div className="col-span-12 text-lg md:col-span-5">
                curriculum
              </div>
              <div className="col-span-12 flex flex-col gap-2 md:col-span-7">
                <InputField
                  {...generalForm.register("semcount")}
                  label="number of sems per year"
                  error={generalForm.formState.errors.semcount?.message}
                />
                <InputField
                  {...generalForm.register("yrstart")}
                  label="starting year"
                  error={generalForm.formState.errors.yrstart?.message}
                />
              </div>
              <div className="col-span-12 text-lg md:col-span-5">semesters</div>
              <div className="col-span-12 flex flex-col gap-2 md:col-span-7">
                <div className="my-2 flex gap-4">
                  <Switch
                    checked={hasmidyearController.field.value}
                    onChange={hasmidyearController.field.onChange}
                    name="hasmidyear"
                    className={`${
                      hasmidyearController.field.value
                        ? "bg-teal-500"
                        : "bg-zinc-200 dark:bg-zinc-800"
                    } relative inline-flex h-7 min-w-[44px] items-center rounded-full transition-colors duration-150`}
                  >
                    <span
                      className={`${
                        hasmidyearController.field.value
                          ? "translate-x-5 bg-white"
                          : "translate-x-1 bg-zinc-100 dark:bg-zinc-900"
                      } inline-block h-5 w-5 transform rounded-full shadow-lg transition`}
                    />
                  </Switch>
                  <div className="flex flex-col">
                    <span>midyear</span>
                    <span className="text-sm text-zinc-400 dark:text-zinc-600">
                      if this is enabled, midyear semesters will be shown
                      between each year
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-span-12 flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => generalForm.reset()}
                  disabled={
                    generalForm.formState.isSubmitting ||
                    !generalForm.formState.isDirty
                  }
                  variant="base"
                  size="md"
                >
                  cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    generalForm.formState.isSubmitting ||
                    !generalForm.formState.isDirty
                  }
                  variant="primary"
                  size="md"
                >
                  save
                </Button>
              </div>
            </div>
          </form>
          <div className="text-xl font-thin">appearance</div>
          <div className="text-zinc-400 dark:text-zinc-600">
            visual customization options
          </div>
          <form
            onSubmit={appearanceForm.handleSubmit(saveAppearance)}
            className="my-6 rounded border-2 border-zinc-200 dark:border-zinc-800"
          >
            <div className="grid grid-cols-12 gap-y-2 p-8 md:gap-y-8">
              <div className="col-span-12 text-lg md:col-span-5">theme</div>
              <div className="col-span-12 flex flex-col gap-2 md:col-span-7">
                <div className="my-2 flex gap-4">
                  <Switch
                    checked={darkController.field.value}
                    onChange={darkController.field.onChange}
                    name="midyear"
                    className={`${
                      darkController.field.value
                        ? "bg-teal-500"
                        : "bg-zinc-200 dark:bg-zinc-800"
                    } relative inline-flex h-7 min-w-[44px] items-center rounded-full transition-colors duration-150`}
                  >
                    <span
                      className={`${
                        darkController.field.value
                          ? "translate-x-5 bg-white"
                          : "translate-x-1 bg-zinc-100 dark:bg-zinc-900"
                      } inline-block h-5 w-5 transform rounded-full shadow-lg transition`}
                    />
                  </Switch>
                  <div className="flex flex-col">
                    <span>dark mode</span>
                    <span className="text-sm text-zinc-400 dark:text-zinc-600">
                      toggle dark mode
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-span-12 text-lg md:col-span-5">
                connections
              </div>
              <div className="col-span-12 flex flex-col gap-2 md:col-span-7">
                <div className="my-2 flex gap-4">
                  <Switch
                    checked={animateConnectionsController.field.value}
                    onChange={animateConnectionsController.field.onChange}
                    name="midyear"
                    className={`${
                      animateConnectionsController.field.value
                        ? "bg-teal-500"
                        : "bg-zinc-200 dark:bg-zinc-800"
                    } relative inline-flex h-7 min-w-[44px] items-center rounded-full transition-colors duration-150`}
                  >
                    <span
                      className={`${
                        animateConnectionsController.field.value
                          ? "translate-x-5 bg-white"
                          : "translate-x-1 bg-zinc-100 dark:bg-zinc-900"
                      } inline-block h-5 w-5 transform rounded-full shadow-lg transition`}
                    />
                  </Switch>
                  <div className="flex flex-col">
                    <span>animate connections</span>
                    <span className="text-sm text-zinc-400 dark:text-zinc-600">
                      show animation on highlighted connections
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-span-12 flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => appearanceForm.reset()}
                  disabled={
                    appearanceForm.formState.isSubmitting ||
                    !appearanceForm.formState.isDirty
                  }
                  variant="base"
                  size="md"
                >
                  cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    appearanceForm.formState.isSubmitting ||
                    !appearanceForm.formState.isDirty
                  }
                  variant="primary"
                  size="md"
                >
                  save
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default Settings;
