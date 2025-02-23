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

  @Column({ enum: ['PENDING', 'DONE', 'IN_PROGRESS'], default: 'PENDING' })
  status: string;

  @Column()
  dueDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @BeforeInsert()
  generateId() {
    this.id = uuid();
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
