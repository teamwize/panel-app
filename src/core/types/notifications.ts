import { UserResponse } from "@/core/types/user.ts";

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SLACK = 'SLACK'
}

export enum NotificationTriggerStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  ARCHIVED = 'ARCHIVED'
}

export enum EventType {
  ORGANIZATION_CREATED = 'ORGANIZATION_CREATED',
  USER_CREATED = 'USER_CREATED',
  LEAVE_CREATED = 'LEAVE_CREATED',
  LEAVE_STATUS_UPDATED = 'LEAVE_STATUS_UPDATED',
  TEAM_CREATED = 'TEAM_CREATED',
  NOTIFICATION_CREATED = 'NOTIFICATION_CREATED'
}

export interface NotificationTemplate {
  id: number;
  name: string;
  textTemplate: string;
  htmlTemplate: string;
  status: string;
}

export interface NotificationTrigger {
  id: number;
  eventType: EventType;
  name:string;
  title:string;
  textTemplate:string;
  htmlTemplate:string;
  template: NotificationTemplate;
  channels: NotificationChannel[];
  receptors: string;
  status: NotificationTriggerStatus;
}

export interface NotificationTriggerCreateRequest {
    title: string;
    name: string;
    textTemplate: string;
    htmlTemplate: string;
    eventType: EventType;
    templateId: number;
    channels: NotificationChannel[];
    receptors: string;
}

export interface NotificationFilterRequest {
    eventType?: EventType;
    channel?: NotificationChannel;
    startDate?: string;
    endDate?: string;
}

export interface Notification {
    id: number;
    user: UserResponse;
    template: NotificationTemplate;
    trigger: NotificationTrigger;
    textContent: string;
    htmlContent: string;
    event: EventType;
    params: Record<string, any>;
    channel: NotificationChannel;
    sentAt: string;
    createdAt: string;
    status: NotificationStatus;
}

export enum NotificationStatus {
    PENDING = 'PENDING',
    SENT = 'SENT',
    FAILED = 'FAILED'
}

export interface EventSchema {
    name: string;
    description: string;
    schema: SchemaObject;
    receptors: string[];
}

export interface SchemaObject {
    type: string;
    properties?: FieldSchema[];
}

export interface FieldSchema {
    name: string;
    type: string;
    required: boolean;
    description?: string;
    enumValues?: string[];
    properties?: FieldSchema[];
    items?: ItemSchema;
}

export interface ItemSchema {
    type: string;
    enumValues?: string[];
    properties?: FieldSchema[];
}