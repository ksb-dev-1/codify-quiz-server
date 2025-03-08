"use client";

import Link from "next/link";

// constants
import { getStatusIcon } from "@/constants/statuses";

// types
import { Question } from "@/types/types";

// components
import QuestionListSkeleton from "@/components/skeletons/QuestionListSkeleton";
import QuestionsHeader from "@/components/shared/QuestionsHeader";
import SaveQuestionButton from "@/components/SaveQuestionButton";
import RemoveQuestionButton from "@/components/RemoveQuestionButton";

interface QuestionListProps {
  questionsLoading: boolean;
  questionsError: boolean;
  questions: Question[];
  isFilterApplied: boolean;
}

export default function QuestionList({
  questionsLoading,
  questionsError,
  questions,
  isFilterApplied,
}: QuestionListProps) {
  if (questionsLoading) {
    return <QuestionListSkeleton text="Questions" marginTop="mt-8" />;
  }

  if (questionsError) {
    return (
      <p className="mt-8 text-center text-red-600 text-xl">
        Failed to fetch questions! Refresh the page or check your internet
        connection.
      </p>
    );
  }

  if (questions.length === 0 && !isFilterApplied) {
    return <p className="text-xl mt-8">No questions found!</p>;
  }

  if (questions.length === 0 && isFilterApplied) {
    return (
      <p className="text-center text-xl mt-8">
        No questions found! Try using different filters.
      </p>
    );
  }

  return (
    <div className="mt-8">
      <QuestionsHeader text="Questions" />
      <div className="border-x">
        {questions.map(
          ({ id, qNo, status, topicName, difficulty, isSaved }) => {
            const StatusIcon = getStatusIcon(status);

            // Define colors statically
            let statusIconColor = "";

            if (status === "TODO") {
              statusIconColor = "text-primary";
            } else if (status === "SOLVED") {
              statusIconColor = "text-emerald-700";
            } else if (status === "ATTEMPTED") {
              statusIconColor = "text-orange-600";
            }

            // Define colors statically
            let difficultyTextColor = "";

            if (difficulty === "EASY") {
              difficultyTextColor = "text-teal-700";
            } else if (difficulty === "MEDIUM") {
              difficultyTextColor = "text-yellow-700";
            } else if (difficulty === "HARD") {
              difficultyTextColor = "text-red-600";
            }

            return (
              <div
                key={id}
                className="w-full border-b p-4 sm:p-6 flex flex-row justify-between sm:justify-normal"
              >
                <div className="w-full flex sm:items-center flex-col-reverse sm:flex-row justify-between sm:justify-normal">
                  {/* Status */}
                  <span className="sm:w-[calc(42.85px+2rem)] flex items-center">
                    {StatusIcon && (
                      <StatusIcon
                        className={`text-xl mr-2 ${statusIconColor}`}
                      />
                    )}
                  </span>

                  {/* Topic */}
                  <div className="sm:w-full">
                    <div className="w-fit flex items-cente">
                      <span className="mr-2">{qNo}.</span>
                      <Link
                        href={`/pages/questions/${id}`}
                        className=" text-blue-600 underline"
                      >
                        {topicName}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="sm:mt-0 flex flex-col sm:flex-row items-end sm:items-center justify-between sm:justify-normal">
                  {/* Difficulty */}
                  <span
                    className={`sm:w-[calc(64.81px+2rem)] flex justify-end ${difficultyTextColor}`}
                  >
                    {difficulty.charAt(0) +
                      difficulty.substring(1).toLowerCase()}
                  </span>

                  <span className="sm:w-[calc(34.55px+2rem)] flex justify-end">
                    {isSaved ? (
                      <RemoveQuestionButton questionId={id} marginTop="mt-6" />
                    ) : (
                      <SaveQuestionButton questionId={id} marginTop="mt-6" />
                    )}
                  </span>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
