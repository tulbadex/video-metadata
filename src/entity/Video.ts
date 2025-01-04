import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from "typeorm";
  
  @Entity('videos')
  export class Video {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column()
    title: string;
  
    @Column('text', { nullable: true })
    description: string;
  
    @Column()
    duration: number;

    @Index()
    @Column()
    genre: string;

    @Index("tags_index")
    @Column("simple-array")
    tags: string[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }  