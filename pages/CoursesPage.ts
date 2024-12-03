import { type Locator, type Page } from "@playwright/test"

export class CoursesPage {
    readonly page: Page;
    readonly header: Locator;
    readonly displayedCourses: Locator;
    readonly img: Locator;
    readonly courseNames: Locator;
    readonly schoolTag: Locator;
    readonly coursePrices: Locator;
    readonly discountTags: Locator;
    readonly addToCartButtons: Locator;
    readonly cartHeader: Locator;
    readonly cartItems: Locator;
    readonly totalPrice: Locator;
    readonly placeOrderBtn: Locator;
    readonly successMsg: Locator;


    constructor(page: Page) {
        this.page = page;
        this.header = page.locator('.mt-2');
        this.displayedCourses = page.locator('[id^="course"]');
        this.img = page.locator('img[alt^="Course"]');
        this.courseNames = page.locator('.p-2 > h3');
        this.schoolTag = page.locator('.my-3');
        this.coursePrices = page.locator('.mb-1 > strong');
        this.discountTags = page.locator('[data-testid="discount"]');
        this.addToCartButtons = page.locator('button:has-text("Add to Cart")');
        this.cartHeader = page.locator('.mb-2');
        this.cartItems = page.locator('[class$="BMnRK"]');
        this.totalPrice = page.locator('#total-price');
        this.placeOrderBtn = page.locator('.mt-3');
        this.successMsg = page.locator('.mt-1');
        
    };

    async goto() {
        await this.page.goto('https://www.techglobal-training.com/frontend/project-8');
    };

    async validateAllCourseImagesVisible(): Promise<boolean> {
        const imagesVisible = await this.img.evaluateAll((imgs: HTMLImageElement[] )=> 
            imgs.every((img) => img.complete && img.naturalWidth > 0)
        );
        return imagesVisible
    }

    async validateSchoolTags(): Promise<boolean> {
        const tags = await this.schoolTag.allTextContents();
        return tags.every(tag => tag.includes('TechGlobal School'));
    }

    async validateAddToCartButtons(): Promise<boolean> {
        const buttonCount = await this.addToCartButtons.count();
        for(let i = 0; i < buttonCount; i++) {
            const button = this.addToCartButtons.nth(i);

            const isVisible = await button.isVisible();
            if (!isVisible) return false;

            const isEnabled = await button.isEnabled();
            if (!isEnabled) return false;

            const buttonText = await button.textContent();
            if (buttonText?.trim() !== 'Add to Cart') return false;
        }
        return true;
    }

    async isCartEmpty(): Promise<boolean> {
        const cartItemCount = await this.cartItems.count();
        return cartItemCount === 0; 
    }

    async validatePlaceOrderButton(placeOrderBtn: Locator): Promise<boolean> {

            const isVisible = await placeOrderBtn.isVisible();
            if (!isVisible) return false;

            const isDisabled = await placeOrderBtn.isDisabled();
            if (!isDisabled) return false;

            const buttonText = await placeOrderBtn.textContent();
            if (buttonText?.trim() !== 'Place Order') return false;
            return true;
        }
    }