import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Category, ProductService } from '@/pages/products/product.service';

@Component({
  selector: 'app-admin-categories',
  imports: [
    CommonModule, FormsModule, ButtonModule, TableModule, DialogModule,
    InputTextModule, InputNumberModule, CheckboxModule, SelectModule,
    TagModule, ConfirmDialogModule, ToastModule
  ],
  providers: [ConfirmationService],
  templateUrl: './admin-categories.html'
})
export class AdminCategories implements OnInit {
  categories: Category[] = [];
  loading = false;

  displayDialog = false;
  editing: Category | null = null;
  form: {
    id: number | null;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    sortOrder: number;
    active: boolean;
    parentId: number | null;
  } = this.emptyForm();

  parentOptions: { label: string; value: number | null }[] = [];

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.productService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.updateParentOptions();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ key: 'global', severity: 'error', summary: 'Error', detail: 'Failed to load categories' });
      }
    });
  }

  parentName(category: Category): string {
    if (!category.parentId) return '-';
    return this.categories.find(c => c.id === category.parentId)?.name ?? '-';
  }

  private updateParentOptions(excludeId: number | null = null) {
    this.parentOptions = [
      { label: 'None (Top Level)', value: null },
      ...this.categories.filter(c => c.id !== excludeId).map(c => ({ label: c.name, value: c.id }))
    ];
  }

  emptyForm() {
    return { id: null, name: '', slug: '', description: '', imageUrl: '', sortOrder: 0, active: true, parentId: null };
  }

  openCreate() {
    this.editing = null;
    this.form = this.emptyForm();
    this.updateParentOptions();
    this.displayDialog = true;
  }

  openEdit(category: Category) {
    this.editing = category;
    this.updateParentOptions(category.id);
    this.form = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      sortOrder: category.sortOrder,
      active: category.active,
      parentId: category.parentId ?? null
    };
    this.displayDialog = true;
  }

  save() {
    if (!this.form.name?.trim()) {
      this.messageService.add({ key: 'global', severity: 'warn', summary: 'Name required', detail: 'Category name is required' });
      return;
    }

    const payload = {
      name: this.form.name,
      slug: this.form.slug,
      description: this.form.description,
      imageUrl: this.form.imageUrl,
      sortOrder: this.form.sortOrder,
      active: this.form.active,
      parentId: this.form.parentId
    };

    const req = this.editing
      ? this.productService.updateCategory(this.editing.id, payload)
      : this.productService.createCategory(payload);

    req.subscribe({
      next: () => {
        this.messageService.add({ key: 'global', severity: 'success', summary: 'Saved', detail: `Category ${this.editing ? 'updated' : 'created'} successfully` });
        this.displayDialog = false;
        this.load();
      },
      error: (err) => {
        this.messageService.add({ key: 'global', severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed to save category' });
      }
    });
  }

  delete(category: Category) {
    this.confirmationService.confirm({
      message: `Delete category "${category.name}"? This cannot be undone.`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteCategory(category.id).subscribe({
          next: () => {
            this.messageService.add({ key: 'global', severity: 'success', summary: 'Deleted', detail: 'Category deleted' });
            this.load();
          },
          error: (err) => {
            this.messageService.add({ key: 'global', severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed to delete category' });
          }
        });
      }
    });
  }
}
