import type { FC } from "react";

type SkillGroupsProps = {
  /** Years of production use; could teach it. */
  deep: string[];
  /** Shipped with it; comfortable but not an expert. */
  working: string[];
  /** Actively learning right now. */
  learning: string[];
};

export const SkillGroups: FC<SkillGroupsProps> = ({
  deep,
  working,
  learning,
}) => {
  const groups = [
    { title: "Deep", skills: deep },
    { title: "Working", skills: working },
    { title: "Learning", skills: learning },
  ];

  // not-prose: this sits inside MDX, and the list styles here are our own.
  return (
    <div className="not-prose my-8 grid gap-6 sm:grid-cols-3">
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="text-sm font-medium text-muted">{group.title}</h3>
          <ul className="mt-3 space-y-1.5">
            {group.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
