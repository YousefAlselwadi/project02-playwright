import { test, expect } from '@playwright/test';
import { CoursesPage } from '../../pages/CoursesPage';

test.describe("project02", () => {

    let coursesPage: CoursesPage;

    test.beforeEach(async ({ page }) => {
        coursesPage = new CoursesPage(page)
        await page.goto("https://www.techglobal-training.com/frontend/project-8");
    });
    
    test("Test Case 01 - Available Courses Section Validation", async ({ page }) => {
        const TaskName = 'Available Courses';
        await expect(coursesPage.header).toHaveText(TaskName);
        
        const courseCount = await coursesPage.displayedCourses.count();
        expect(courseCount).toBe(3);

        const allImagesVisible = await coursesPage.validateAllCourseImagesVisible();
        expect(allImagesVisible).toBeTruthy();

        const courseNamesCount = await coursesPage.courseNames.count()
        expect(courseNamesCount).toBe(3);

        const prices = await coursesPage.coursePrices.allTextContents();
        prices.forEach(price => {
            const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '') || '0');
            expect(numericPrice).toBeGreaterThan(0);
        });

        const allTagsValid = await coursesPage.validateSchoolTags();
        expect(allTagsValid).toBe(true);

        const dicountTagCount = await coursesPage.discountTags.count();
        expect(dicountTagCount).toBe(2);

        const areButtonsValid = await coursesPage.validateAddToCartButtons();
        expect(areButtonsValid).toBe(true);
    });

    test("Test Case 02 - Cart Section Validation", async ({ page }) => {
        const cartName = 'Items Added to Cart';
        await expect(coursesPage.cartHeader).toHaveText(cartName);

        const isCartEmpty = await coursesPage.isCartEmpty();
        expect(isCartEmpty).toBe(true);

        const prices = await coursesPage.totalPrice.allTextContents();
        prices.forEach(price => {
            const numPrice = parseFloat(price.replace(/[^0-9.]/g, '') || '0');
            expect(numPrice).toBe(0);
        });

        const isButtonValid = await coursesPage.validatePlaceOrderButton(coursesPage.placeOrderBtn);
        expect(isButtonValid).toBe(true);
    });

    test("Test Case 03 - Add a Course to the Cart and Validate", async ({ page }) => {
        await coursesPage.addToCartButtons.nth(0).click();
        await expect(coursesPage.cartItems).toBeVisible();
        const coursePriceText = await coursesPage.coursePrices.nth(0).textContent();
        const coursePrice = parseFloat(coursePriceText?.replace(/[^0-9.]/g, '') || '0');
        const expectedTotalPrice = coursePrice - 20;
        const totalPriceText = await coursesPage.totalPrice.textContent();
        const totalPrice = parseFloat(totalPriceText?.replace(/[^0-9.]/g, '') || '0');
        expect(totalPrice).toBe(expectedTotalPrice);
        await coursesPage.placeOrderBtn.click();

        const successMessage = 'Your order has been placed.';
        await expect(coursesPage.successMsg).toHaveText(successMessage);
        
        const isCartEmpty = await coursesPage.isCartEmpty();
        expect(isCartEmpty).toBe(true);

    });

    test("Test Case 04 - Add Two Courses to the Cart and Validate", async ({ page }) => {
        await coursesPage.addToCartButtons.nth(0).click();
        await coursesPage.addToCartButtons.nth(1).click();
        const cartItemCount = await coursesPage.cartItems.count();
        expect(cartItemCount).toBe(2);

        const firstCoursePriceText = await coursesPage.coursePrices.nth(0).textContent();
        const secondCoursePriceText = await coursesPage.coursePrices.nth(1).textContent();
        const firstCoursePrice = parseFloat(firstCoursePriceText?.replace(/[^0-9.]/g, '') || '0');
        const secondCoursePrice = parseFloat(secondCoursePriceText?.replace(/[^0-9.]/g, '') || '0');
        const expectedTotalPrice = firstCoursePrice + secondCoursePrice - 28;
        const totalPriceText = await coursesPage.totalPrice.textContent();
        const displayedTotalPrice = parseFloat(totalPriceText?.replace(/[^0-9.]/g, '') || '0');
        expect(displayedTotalPrice).toBe(expectedTotalPrice);

        await coursesPage.placeOrderBtn.click();

        const successMessage = 'Your order has been placed.';
        await expect(coursesPage.successMsg).toHaveText(successMessage);

        const isCartEmpty = await coursesPage.isCartEmpty();
        expect(isCartEmpty).toBe(true);

    });

    test("Test Case 05 - Add All Three Courses to the Cart and Validate", async ({ page }) => {
        await coursesPage.addToCartButtons.nth(0).click();
        await coursesPage.addToCartButtons.nth(1).click();
        await coursesPage.addToCartButtons.nth(2).click();

        const cartItemCount = await coursesPage.cartItems.count();
        expect(cartItemCount).toBe(3);

        const firstCoursePriceText = await coursesPage.coursePrices.nth(0).textContent();
        const secondCoursePriceText = await coursesPage.coursePrices.nth(1).textContent();
        const thirdCoursePriceText = await coursesPage.coursePrices.nth(1).textContent();
        const firstCoursePrice = parseFloat(firstCoursePriceText?.replace(/[^0-9.]/g, '') || '0');
        const secondCoursePrice = parseFloat(secondCoursePriceText?.replace(/[^0-9.]/g, '') || '0');
        const thirdCoursePrice = parseFloat(thirdCoursePriceText?.replace(/[^0-9.]/g, '') || '0');
        const expectedTotalPrice = firstCoursePrice + secondCoursePrice + thirdCoursePrice - 28;
        const totalPriceText = await coursesPage.totalPrice.textContent();
        const displayedTotalPrice = parseFloat(totalPriceText?.replace(/[^0-9.]/g, '') || '0');
        expect(displayedTotalPrice).toBe(expectedTotalPrice);

        await coursesPage.placeOrderBtn.click();

        const successMessage = 'Your order has been placed.';
        await expect(coursesPage.successMsg).toHaveText(successMessage);

        const isCartEmpty = await coursesPage.isCartEmpty();
        expect(isCartEmpty).toBe(true);
    });
});