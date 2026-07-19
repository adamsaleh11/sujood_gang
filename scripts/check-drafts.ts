type DraftMatch = {
  filePath: string;
  count: number;
};

async function main(): Promise<void> {
  const fs = await import("node:fs");
  const path = await import("node:path");

  const rootDir = process.cwd();
  const draftMarker = "DRAFT" + "(ai)";
  const ignoredDirectories = new Set([
    ".agents",
    ".claude",
    ".git",
    ".next",
    "coverage",
    "node_modules",
    "out",
  ]);
  const ignoredFiles = new Set([
    "pnpm-lock.yaml",
    "package-lock.json",
    "yarn.lock",
  ]);
  const searchableExtensions = new Set([
    ".css",
    ".js",
    ".jsx",
    ".md",
    ".mjs",
    ".ts",
    ".tsx",
    ".yml",
    ".yaml",
  ]);

  function countDraftMarkers(fileContents: string): number {
    return fileContents.split(draftMarker).length - 1;
  }

  function shouldSearchFile(filePath: string): boolean {
    return (
      searchableExtensions.has(path.extname(filePath)) &&
      !ignoredFiles.has(path.basename(filePath))
    );
  }

  function walkDirectory(directoryPath: string): string[] {
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
    const filePaths: string[] = [];

    for (const entry of entries) {
      if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
        continue;
      }

      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        filePaths.push(...walkDirectory(entryPath));
        continue;
      }

      if (entry.isFile() && shouldSearchFile(entryPath)) {
        filePaths.push(entryPath);
      }
    }

    return filePaths;
  }

  const matches: DraftMatch[] = walkDirectory(rootDir)
    .map((filePath) => ({
      filePath: path.relative(rootDir, filePath),
      count: countDraftMarkers(fs.readFileSync(filePath, "utf8")),
    }))
    .filter((match) => match.count > 0)
    .sort((a, b) => a.filePath.localeCompare(b.filePath));

  const totalDrafts = matches.reduce((total, match) => total + match.count, 0);

  console.log(`Draft marker count: ${totalDrafts}`);

  for (const match of matches) {
    console.log(`${match.filePath}: ${match.count}`);
  }

  console.log("Non-blocking check: launch gate passes only when count is 0.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
