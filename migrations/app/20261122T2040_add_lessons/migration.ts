#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/e3814526e91019f1c8ef6b140117cfe419e769b56467c8ec7bddf93de38a5dee/contract';
import endContract from '../../snapshots/e3814526e91019f1c8ef6b140117cfe419e769b56467c8ec7bddf93de38a5dee/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/f02185d0cc55693da4bef5396f6f7379a242c5cf1d1cee9b198b7c8b8ee8d15e/contract';
import startContract from '../../snapshots/f02185d0cc55693da4bef5396f6f7379a242c5cf1d1cee9b198b7c8b8ee8d15e/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Lesson',
        columns: [
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('courseId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('position', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'LessonProgress',
        columns: [
          col('completedAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lessonId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Lesson',
        constraint: 'Lesson_courseId_position_key',
        columns: ['courseId', 'position'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'LessonProgress',
        constraint: 'LessonProgress_userId_lessonId_key',
        columns: ['userId', 'lessonId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Lesson',
        index: 'Lesson_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'LessonProgress',
        index: 'LessonProgress_lessonId_idx_e358970d',
        columns: ['lessonId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'LessonProgress',
        index: 'LessonProgress_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Lesson',
        foreignKey: {
          name: 'Lesson_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'Course', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'LessonProgress',
        foreignKey: {
          name: 'LessonProgress_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'LessonProgress',
        foreignKey: {
          name: 'LessonProgress_lessonId_fkey',
          columns: ['lessonId'],
          references: { schema: 'public', table: 'Lesson', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.enableRowLevelSecurity({ schema: 'public', table: 'Lesson' }),
      this.enableRowLevelSecurity({ schema: 'public', table: 'LessonProgress' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
