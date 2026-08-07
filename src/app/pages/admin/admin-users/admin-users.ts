import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Tooltip } from 'primeng/tooltip';
import { AdminUser, AdminUsersService } from './admin-users.service';
import { JwtHelper } from '@/jwt/jwt-helper';

@Component({
  selector: 'app-admin-users',
  imports: [
    CommonModule, FormsModule, ButtonModule, TableModule, TagModule, SelectModule,
    ToggleSwitchModule, ConfirmDialogModule, ToastModule, IconFieldModule, InputIconModule, InputTextModule, Tooltip
  ],
  providers: [ConfirmationService],
  templateUrl: './admin-users.html'
})
export class AdminUsers implements OnInit {
  @ViewChild('dt') dt!: Table;

  users: AdminUser[] = [];
  loading = false;
  currentUserId: number | null = null;

  roleOptions = [
    { label: 'Customer', value: 'ROLE_USER' },
    { label: 'Admin', value: 'ROLE_ADMIN' }
  ];

  constructor(
    private usersService: AdminUsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private jwtHelper: JwtHelper
  ) {}

  ngOnInit() {
    this.currentUserId = this.jwtHelper.getUserDetails()?.id ?? null;
    this.load();
  }

  load() {
    this.loading = true;
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ key: 'global', severity: 'error', summary: 'Error', detail: 'Failed to load users' });
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  primaryRole(user: AdminUser): string {
    return user.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';
  }

  changeRole(user: AdminUser, role: string) {
    if (user.id === this.currentUserId && role !== 'ROLE_ADMIN') {
      this.messageService.add({ key: 'global', severity: 'warn', summary: 'Not allowed', detail: "You can't remove your own admin access" });
      this.load();
      return;
    }

    this.usersService.updateRole(user.id, role).subscribe({
      next: (updated) => {
        Object.assign(user, updated);
        this.messageService.add({ key: 'global', severity: 'success', summary: 'Updated', detail: `${user.username} is now ${role === 'ROLE_ADMIN' ? 'an admin' : 'a customer'}` });
      },
      error: () => {
        this.messageService.add({ key: 'global', severity: 'error', summary: 'Error', detail: 'Failed to update role' });
        this.load();
      }
    });
  }

  toggleEnabled(user: AdminUser) {
    if (user.id === this.currentUserId) {
      this.messageService.add({ key: 'global', severity: 'warn', summary: 'Not allowed', detail: "You can't disable your own account" });
      return;
    }

    const next = !user.enabled;
    this.usersService.toggleStatus(user.id, next).subscribe({
      next: (updated) => {
        Object.assign(user, updated);
        this.messageService.add({ key: 'global', severity: 'success', summary: 'Updated', detail: `${user.username} ${next ? 'enabled' : 'disabled'}` });
      },
      error: () => {
        this.messageService.add({ key: 'global', severity: 'error', summary: 'Error', detail: 'Failed to update status' });
      }
    });
  }

  deleteUser(user: AdminUser) {
    if (user.id === this.currentUserId) {
      this.messageService.add({ key: 'global', severity: 'warn', summary: 'Not allowed', detail: "You can't delete your own account" });
      return;
    }

    this.confirmationService.confirm({
      message: `Delete user "${user.username}"? This cannot be undone.`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(user.id).subscribe({
          next: () => {
            this.messageService.add({ key: 'global', severity: 'success', summary: 'Deleted', detail: 'User deleted' });
            this.load();
          },
          error: () => {
            this.messageService.add({ key: 'global', severity: 'error', summary: 'Error', detail: 'Failed to delete user' });
          }
        });
      }
    });
  }
}
