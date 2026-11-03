#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/d30b2a43fe98f479d5c0de30792815d1a96e199bce6a9331514026e0004e3f00/contract';
import startContract from '../../snapshots/d30b2a43fe98f479d5c0de30792815d1a96e199bce6a9331514026e0004e3f00/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f02185d0cc55693da4bef5396f6f7379a242c5cf1d1cee9b198b7c8b8ee8d15e/contract';
import endContract from '../../snapshots/f02185d0cc55693da4bef5396f6f7379a242c5cf1d1cee9b198b7c8b8ee8d15e/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.enableRowLevelSecurity({ schema: 'public', table: 'Course' }),
      this.enableRowLevelSecurity({ schema: 'public', table: 'Enrollment' }),
      this.enableRowLevelSecurity({ schema: 'public', table: 'User' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
