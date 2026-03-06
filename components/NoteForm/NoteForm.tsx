"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";

import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api";
import type { CreateNotePayload, NoteTag } from "@/types/note";

interface NoteFormProps {
  onClose: () => void;
}

type NoteFormValues = CreateNotePayload;

const TAG_OPTIONS: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),
  content: Yup.string()
    .trim()
    .max(500, "Content must be at most 500 characters")
    .notRequired(),
  tag: Yup.mixed<NoteTag>()
    .oneOf(TAG_OPTIONS, "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  const handleSubmit = async (
    values: NoteFormValues,
    helpers: FormikHelpers<NoteFormValues>,
  ) => {
    try {
      await mutation.mutateAsync(values);
      helpers.resetForm();
    } catch {
      // Ошибку запроса отображаем общим сообщением (валидация — через Yup/ErrorMessage)
      // Можно улучшить, если у вас есть формат ошибок от API
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <label className={css.label}>
            Title
            <Field className={css.input} name="title" type="text" />
            <ErrorMessage className={css.error} name="title" component="p" />
          </label>

          <label className={css.label}>
            Content
            <Field className={css.textarea} name="content" as="textarea" />
            <ErrorMessage className={css.error} name="content" component="p" />
          </label>

          <label className={css.label}>
            Tag
            <Field className={css.select} name="tag" as="select">
              {TAG_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <ErrorMessage className={css.error} name="tag" component="p" />
          </label>

          {mutation.isError && (
            <p className={css.error}>Something went wrong.</p>
          )}

          <div className={css.actions}>
            <button
              className={css.button}
              type="submit"
              disabled={isSubmitting || mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create note"}
            </button>

            <button
              className={css.cancel}
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
