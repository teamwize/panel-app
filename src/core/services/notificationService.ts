import { PagedResponse } from '../types/common';
import axiosInstance from './httpService';
import {
    EventSchema,
    NotificationFilterRequest,
    NotificationTemplate,
    NotificationTrigger,
    NotificationTriggerCreateRequest,
    Notification, NotificationsCountResponse
} from '@/core/types/notifications.ts';

const baseURL = '/v1/notifications';

async function getTemplate(id: number): Promise<NotificationTemplate> {
    const response = await axiosInstance.get(`${baseURL}/templates/${id}`);
    return response.data;
}

async function getTemplates(): Promise<NotificationTemplate[]> {
    const response = await axiosInstance.get(`${baseURL}/templates`);
    return response.data;
}

async function deleteTemplate(id: number): Promise<void> {
    await axiosInstance.delete(`${baseURL}/templates/${id}`);
}

async function getNotificationTriggers(): Promise<NotificationTrigger[]> {
    const response = await axiosInstance.get(`${baseURL}/triggers`);
    return response.data;
}

async function createNotificationTrigger(payload: NotificationTriggerCreateRequest): Promise<NotificationTrigger> {
    const response = await axiosInstance.post(`${baseURL}/triggers`, payload);
    return response.data;
}

async function getNotifications(payload: NotificationFilterRequest,page: number,size: number): Promise<PagedResponse<Notification>> {
    const response = await axiosInstance.get(`${baseURL}`, { params: { ...payload, page, size } });
    return response.data;
}

async function getNotificationEventSchemas() : Promise<EventSchema[]> {
    const response = await axiosInstance.get(`${baseURL}/events`);
    return response.data;
}

async function deleteNotificationTrigger(id:number) : Promise<void> {
    await axiosInstance.get(`${baseURL}/notifications/triggers/${id}`)
}

async function getNotificationsCount() : Promise<NotificationsCountResponse> {
    const response = await axiosInstance.get(`${baseURL}/count`);
    return response.data;
}

async function createNotificationRead(payload: number[]): Promise<NotificationsCountResponse> {
    const response = await axiosInstance.post(`${baseURL}/read`, payload);
    return response.data;
}

export {getTemplate, getTemplates, deleteTemplate, getNotificationTriggers, createNotificationTrigger, getNotifications, getNotificationEventSchemas, deleteNotificationTrigger,getNotificationsCount, createNotificationRead};
