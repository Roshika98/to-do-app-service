import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { v4 as uuid } from 'uuid';

@Entity()
export class Task {
  @PrimaryColumn({ type: 'uuid' })
  @Index()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ enum: ['PENDING', 'DONE'], default: 'PENDING' })
  status: string;

  @Column()
  dueDate: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @BeforeInsert()
  generateIdAndDates() {
    this.id = uuid();
    const date = new Date();
    this.createdAt = date;
    this.updatedAt = date;
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
