import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Task } from '../tasks/task.entity';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @BeforeInsert()
  generateId() {
    this.id = uuid();
  }
}
