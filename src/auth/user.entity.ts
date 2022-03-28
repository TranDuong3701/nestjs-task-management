import { Task } from 'src/tasks/task.entity';
import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @OneToMany((_type) => Task, (task) => task.user.id, { eager: true })
  tasks: Task[];
}
