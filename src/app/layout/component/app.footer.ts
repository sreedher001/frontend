import { LoginService } from '@/pages/auth/login.service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports:[RouterModule,FormsModule],
    template: `<footer class="bg-grey-700 text-black py-12 px-6 md:px-16">
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

    <!-- Branding -->
    <div>
      <a href="/" class="text-2xl font-bold tracking-wide text-primary hover:underline my-title">ZFC</a>
      <p class="text-sm text-gray-400 italic mt-2">See through you. Beyond Mirror</p>
    </div>

    <!-- Navigation -->
    <div>
      <h3 class="text-sm font-semibold uppercase text-gray-300 mb-4">Explore</h3>
      <ul class="space-y-2 text-sm text-gray-400">
      <li>  <a [routerLink]="['/home']" fragment="about" class="hover:underline">About</a></li>
<li><a [routerLink]="['/home']" fragment="collections" class="hover:underline">Collections</a></li>
<li><a [routerLink]="['/home']" fragment="bespoke" class="hover:underline">Bespoke</a></li>
<li><a [routerLink]="['/home']" fragment="contact" class="hover:underline">Contact</a></li>

      </ul>
    </div>

    <!-- Newsletter -->
   <div>
  <h3 class="text-sm font-semibold uppercase text-gray-300 mb-4">Stay in Touch</h3>
  <form (submit)="subscribeNewsletter($event)">
    <label for="email" class="block text-sm text-gray-400 mb-2">Join our private mailing list</label>
    <div class="flex">
      <input
        type="email"
        id="email"
        [(ngModel)]="subscriberEmail"
        name="subscriberEmail"
        placeholder="you@example.com"
        required
        class="w-full px-4 py-2 bg-transparent border border-gray-600  placeholder-gray-500 text-sm focus:outline-none" />

      <button
        type="submit"
        class="ml-2 px-4 py-2 bg-orange-600 text-white text-sm uppercase tracking-wide hover:opacity-90">
        Subscribe
      </button>
    </div>

@if(show){<div  class="mt-4 p-4 bg-green-100 text-green-800 rounded-md text-center text-sm">
      Thank you for subscribing! You'll receive our latest updates soon.
    </div>}
  </form>
</div>


    <!-- Social Media -->
    <div>
  <h3 class="text-sm font-semibold uppercase text-gray-900 mb-4">Connect</h3>
  <div class="flex gap-4 mt-2 text-orange-500 text-xl">
    <a href="https://www.instagram.com/zyra.fashion.curves" target="_blank" aria-label="Instagram" class="hover:text-primary">
      <i class="pi pi-instagram"></i>
    </a>
    <a href="https://linkedin.com/yourbrand" target="_blank" aria-label="LinkedIn" class="hover:text-primary">
      <i class="pi pi-linkedin"></i>
    </a>
    <!-- Add more as needed -->
  </div>
</div>


  </div>

  <!-- Divider -->
  <div class="border-t border-gray-800 mt-12 pt-6 text-center text-xs text-gray-500">
   <p>&copy; {{ currentYear }} ZFC. All rights reserved.</p>

    <div class="mt-2">
      <a href="/privacy-policy" class="hover:underline">Privacy Policy</a>
      <span class="mx-2">|</span>
      <a href="/terms" class="hover:underline">Terms & Conditions</a>
    </div>
  </div>
</footer>
`
})
export class AppFooter {
show=false;
subscriberEmail: string = '';
constructor(private newsletterService: LoginService ) {}
    currentYear: number = new Date().getFullYear();
    subscribeNewsletter(event: Event){
        event.preventDefault(); 
const email = this.subscriberEmail.trim();
    if (!email) return;

    console.log('Subscribing email:', email); 

    this.newsletterService.subscribeNewsletter(email).subscribe({
      next: (res:any) => {
        console.log('Subscription successful:', res);
        this.show = true;
        this.subscriberEmail = '';
      },
      error: (err:any) => {
        console.error('Subscription failed:', err);
        this.show = true;
        // Optionally handle error UI
      }
    });
  }
    
}
