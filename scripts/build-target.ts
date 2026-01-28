#!/usr/bin/env bun
/**
 * build script for gitarbor-tui CLI
 * Usage: bun run scripts/build-target.ts <target>
 *
 * Note: Builds natively for the current platform. The target parameter
 * is used for naming the output archive.
 */

import { rmSync, mkdirSync, createWriteStream } from 'fs';
import { existsSync } from 'fs';
import { join } from 'path';
import archiver from 'archiver';

const baseOutputDir = 'dist';

async function build() {
  const args = process.argv.slice(2);
  const target = args[0];

  if (!target) {
    console.error('Usage: bun run scripts/build-target.ts <target>');
    console.error('Example: bun run scripts/build-target.ts linux-arm64');
    process.exit(1);
  }

  const outputDir = join(baseOutputDir, `gitarbor-${target}`);

  // Ensure output directory exists (clean if it exists)
  if (existsSync(outputDir)) {
    console.log(`Cleaning ${outputDir}...`);
    rmSync(outputDir, { recursive: true, force: true });
  }

  console.log(`Creating ${outputDir}...`);
  mkdirSync(outputDir, { recursive: true });

  // Build the binary natively (no cross-compilation target)
  const outfile = join(outputDir, 'gitarbor');
  console.log(`Building for current platform -> ${outfile}...`);

  const buildProcess = Bun.spawn([
    'bun',
    'build',
    'index.tsx',
    '--compile',
    `--outfile=${outfile}`,
  ]);

  const exitCode = await buildProcess.exited;

  if (exitCode !== 0) {
    console.error('Build failed!');
    process.exit(exitCode);
  }

  // Create archive based on target platform
  const archiveName = `gitarbor-${target}`;
  const isLinux = target.includes('linux');

  if (isLinux) {
    // Create .tar.gz for Linux
    const tarFile = `${baseOutputDir}/${archiveName}.tar.gz`;
    console.log(`Creating ${tarFile}...`);

    await createArchive(tarFile, 'tar', outputDir);
    console.log(`✓ Created ${tarFile}`);
  } else {
    // Create .zip for Windows and macOS
    const zipFile = `${baseOutputDir}/${archiveName}.zip`;
    console.log(`Creating ${zipFile}...`);

    await createArchive(zipFile, 'zip', outputDir);
    console.log(`✓ Created ${zipFile}`);
  }

  // delete the target directory after archiving
  console.log(`Cleaning up ${outputDir}...`);
  rmSync(outputDir, { recursive: true, force: true });

  process.exit(0);
}

/**
 * Create an archive (tar.gz or zip) of a directory
 */
async function createArchive(
  outputPath: string,
  format: 'tar' | 'zip',
  sourceDir: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver(format, {
      gzip: format === 'tar',
      gzipOptions: { level: 9 },
    });

    output.on('close', () => resolve());
    output.on('error', reject);
    archive.on('error', reject);

    archive.pipe(output);

    // Add directory contents
    archive.directory(sourceDir, '');

    void archive.finalize();
  });
}

await build();
