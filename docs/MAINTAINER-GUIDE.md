# CAALR Website — Maintainer Guide

This guide explains how to update the CAALR website using the content editor. You do not need any technical knowledge — just a web browser and your login credentials.

## ⭐ The Most Important Thing: Updating the Website Takes Two Steps

Updating the website now happens in **two separate steps**. Think of it like email:

1. **Save your changes** in the editor — like *writing and saving a draft*.
2. **Publish the website** from your Publish page — like *hitting Send*.

**Your changes do NOT appear on the live website until you do step 2.** This is normal and is what keeps the website free to run.

### Step 1 — Save your changes (in the editor)

As you add artists, photos, events, and so on, click the editor's **Publish** button (top right) after each one. Despite its name, this button only **saves** your work into the website's files — it does *not* put it on the public website yet. Save as many changes as you like, across as many sittings as you like.

> Throughout the rest of this guide, wherever it says "click Publish," it means this editor button — it **saves** your change.

### Step 2 — Publish the website (when you're finished)

When you've finished editing and you want everyone to see your changes:

1. Open **caalr.netlify.app/publish** — **bookmark this page!**
2. Click the big green **Publish Website** button
3. The first time only, type the password Calvin gave you (your browser remembers it after that, so next time it's just one click)
4. Watch the little status indicator — when it says **“published,”** you're live
5. Click **Open the live website** to see your changes

You only do step 2 **once**, when you're done — not after every change. It takes about two minutes.

## How to Log In

1. Open your web browser (Chrome, Safari, or Firefox)
2. Go to **caalr.netlify.app/admin** (or caalr.com/admin once the domain is switched)
3. Enter your **email address** and **password**
4. Click **Log In**

You will see the content editor with sections on the left: Artists, Shows & Events, Gallery, News, Pages, and Site Settings.

## Adding a New Artist

1. Click **Artists** in the left sidebar
2. Click the **New Artists** button (top right)
3. Fill in the fields:
   - **Name**: Full name of the artist
   - **Art Medium(s)**: Click "Add medium" for each medium (e.g., Pottery, Watercolor)
   - **Short Bio**: One or two sentences for the Artists page card
   - **Email**: Optional — the artist's contact email
   - **Profile Photo**: Click to upload a photo of the artist
   - **Board Member?** / **Board Role**: Toggle on and set the role if they're on the board
   - **Status**: Leave as "active"
4. Write a longer biography in the text area at the bottom (if left blank, the short bio is shown)
5. Click **Publish** (top right) to **save** the new artist
6. When you're finished editing, **publish the website** to make it live (see the two-step process at the top of this guide)

To show this artist's **artwork**, add it in the **Gallery** section and set each photo's **Artist** field to this person — it appears on their page automatically (artists no longer have their own artwork-upload field).

## Editing an Existing Artist

1. Click **Artists** in the left sidebar
2. Click on the artist's name
3. Make your changes
4. Click **Publish**

## Removing an Artist

If an artist leaves the association:
1. Click **Artists** → click their name
2. Change **Status** from "active" to "alumni"
3. Click **Publish**

This keeps their record in the system but hides them from the website. Do NOT delete them — alumni records are preserved.

## Adding a New Show/Event

1. Click **Shows & Events** in the left sidebar
2. Click **New Shows & Events**
3. Fill in:
   - **Show / Event Name**: e.g., "Annual Spring Art Show and Sale"
   - **Start Date**: Select the date and time
   - **End Date**: Only needed for multi-day events
   - **Venue Name**: e.g., "Lakewood Ranch Town Hall"
   - **Street Address**: The full address (creates a Google Maps link for visitors)
   - **Flyer or Event Photo**: Upload if you have one
   - **Feature on Homepage?**: Toggle on if you want it shown on the home page
   - **Description**: Write details about the event
4. Click **Publish**

**Note:** Events automatically appear as "Upcoming" before the date and "Past" after the date. You don't need to change anything — it happens automatically!

## Adding Gallery Photos

1. Click **Gallery** in the left sidebar
2. Click **New Gallery**
3. Fill in:
   - **Image Title**: A short name for the artwork
   - **Photo**: Upload the image (keep images under 2MB for best results)
   - **Description for Screen Readers**: Describe what's in the photo (this helps visually impaired visitors)
   - **Caption**: Optional — shown below the image
   - **Artist Name**: If you know the artist, enter their URL name (e.g., "wilma-kroese")
   - **Medium**: e.g., "Pottery"
   - **Year**: When the artwork was created
   - **Feature on Homepage?**: Toggle on to show on the home page gallery preview
4. Click **Publish**

## Adding a News Item

1. Click **News & Highlights** in the left sidebar
2. Click **New News & Highlights**
3. Fill in:
   - **Headline**: The title of the article or achievement
   - **Date**: When it happened
   - **Publication or Source**: e.g., "Lakewood Ranch Herald"
   - **Link to Article**: The web address of the article (if available)
   - **Photo**: Upload a related image
   - **Featured?**: Toggle on for important items
   - **Story**: Write a summary or excerpt
4. Click **Publish**

## Updating Meeting Dates and Board Members

### Meeting Schedule
1. Click **Site Settings** → **Meeting Schedule**
2. Update the dates, times, or location as needed
3. Click **Publish**

### Board of Directors
The board list on the About page is built **automatically from the artists**. To change it:
1. Click **Artists** → open the person's profile
2. Toggle **Board Member?** on/off, and set their **Board Role** (e.g. President)
3. Click **Publish**

There is no separate board list to maintain — whoever is marked as a board member (with a role) appears on the About page, ordered President → Vice President → Secretary → Treasurer, then the rest.

## What You Can Edit on Each Page

Almost all visible text and photos are now editable from the CMS:
- **Home Page** (Pages → Home Page): the welcome line, main title, intro sentence, the **slideshow photos**, and the "Our Story" heading, text, and photos.
- **About Page** (Pages → About Page): the page title/subtitle, banner photos, mission, membership, the mission & sidebar photos, and resource links.
- **Page headers** (Pages → Artists/Events/News/Gallery Page): the title + subtitle at the top of each of those sections.
- **Site Settings → General**: the logo, footer tagline, contact email, and footer text.

## Things That Happen Automatically (you don't control these by hand)

- **Artists** are listed **alphabetically**; the homepage shows the first 8.
- Setting an artist's **Status to "alumni"** removes them from the public site.
- **Events** become "Past" automatically once their end date passes; the homepage banner shows the soonest upcoming event (or one you mark **Feature on Homepage**).
- **Gallery** order is featured-first, then newest. Mark **Feature on Homepage** to include a piece in the homepage preview.
- **News** is newest-first, with **Featured** items pinned to the top.
- The footer **copyright year** updates itself.
- Artwork on an **artist's page** comes from **Gallery** items whose **Artist** field is set to that person — add artwork in the Gallery, not on the artist.

## Uploading and Managing Images

**Tips for best results:**
- Keep images **under 2MB** in file size
- Use **JPEG** format (most cameras and phones use this by default)
- Landscape (horizontal) images work best for event photos
- Square images work best for artist profile photos

**To upload:** Click any image field and select a file from your computer, or drag and drop a file onto the image area.

## Troubleshooting

### "My changes aren't showing up"
1. **Did you publish the website?** Saving in the editor is only step 1. Go to **caalr.netlify.app/publish** and click **Publish Website** (step 2). This is by far the most common reason changes don't appear.
2. **Wait about 2 minutes** after clicking Publish Website — the site needs a moment to update. Watch for the status to say "published."
3. **Refresh the page.** Press Ctrl+R (or Cmd+R on Mac) to force a refresh
4. **Clear your browser cache.** Sometimes old pages are stored in your browser

### "I can't log in"
1. Make sure you're going to the right address: **caalr.com/admin**
2. Check that your email and password are correct
3. If you forgot your password, click "Forgot Password" and check your email for a reset link
4. If the reset email doesn't arrive, check your spam/junk folder

### "Something looks wrong on the website"
Contact the developer. Do not try to fix technical issues through the editor — you might make it worse.

### "I accidentally deleted something"
Contact the developer as soon as possible. Deleted content can often be recovered from the version history.
