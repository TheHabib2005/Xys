export const ReviewPanel = ({ sections, validationMap, onJump }: any) => {
  return (
    <div className="space-y-4">
      {sections.map((sec: any, i: number) => {
        const state = validationMap[sec.key];

        return (
          <div key={sec.key} className="border p-4 rounded">
            <button onClick={() => onJump(i)}>
              {sec.label} → {state?.valid ? "✅" : `❌ ${state?.count}`}
            </button>
          </div>
        );
      })}
    </div>
  );
};