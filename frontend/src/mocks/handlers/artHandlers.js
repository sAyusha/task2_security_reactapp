import { rest } from "msw";

const API_BASE_URL = "http://localhost:3001/";

export const artHandlers = [
  // Get all arts
  rest.get(`${API_BASE_URL}/api/arts`, (req, res, ctx) => {
    // Implement logic to return a list of arts
    const arts = [
      // Sample art data
      {
        image: "https://picsum.photos/200/300",
        title: "Art 1",
        creator: "Creator 1",
        description: "Description 1",
        startingBid: 200,
        endingDate: "2021-09-30T00:00:00.000Z",
        artType: "Recent",
        categories: "Painting"
      },
      {
        image: "https://picsum.photos/200/300",
        title: "Art 2",
        creator: "Creator 2",
        description: "Description 2",
        startingBid: 300,
        endingDate: "2021-09-30T00:00:00.000Z",
        artType: "Recent",
        categories: "Drawing"
      },
    ];
    return res(ctx.status(200), ctx.json({ data: arts }));
  }),

  // Create a art
  rest.post(`${API_BASE_URL}/api/arts`, (req, res, ctx) => {
    // Implement logic to create a new art
    const newArt = {
        image: "https://picsum.photos/200/300",
        title: "New Art",
        creator: "New Creator",
        description: "New Description",
        startingBid: 500,
        endingDate: "2021-09-30T00:00:00.000Z",
        artType: "Recent",
        categories: "Digital"
    };
    return res(ctx.status(201), ctx.json(newArt));
  }),

  // Get a art by ID
  rest.get(`${API_BASE_URL}/api/arts/:art_id`, (req, res, ctx) => {
    // Implement logic to retrieve a art by ID
    const artId = req.params.art_id;
    const art = {
        image: "https://picsum.photos/200/300",
        title: "Art",
        creator: "Creator",
        description: "Description",
        startingBid: 700,
        endingDate: "2021-09-30T00:00:00.000Z",
        artType: "Recent",
        categories: "Painting"
    };
    return res(ctx.status(200), ctx.json({ data: art }));
  }),

  // Update a art by ID
  rest.put(`${API_BASE_URL}/api/arts/:art_id`, (req, res, ctx) => {
    // Implement logic to update a art by ID
    const updatedArt = {
        image: "https://picsum.photos/200/300",
        title: "Updated Art",
        creator: "Updated Creator",
        description: "Updated Description",
        startingBid: 500,
        endingDate: "2021-09-30T00:00:00.000Z",
        artType: "Recent",
        categories: "Digital"
    };
    return res(ctx.status(200), ctx.json(updatedArt));
  }),

  // Delete a art by ID
  rest.delete(`${API_BASE_URL}/api/arts/:art_id`, (req, res, ctx) => {
    // Implement logic to delete a art by ID
    return res(ctx.status(204));
  }),

  // Save a art
  rest.post(`${API_BASE_URL}/api/arts/save/:art_id`, (req, res, ctx) => {
    // Implement logic to save a art
    return res(
      ctx.status(201),
      ctx.json({ message: "Art saved successfully" })
    );
  }),

  // Remove save from a art
  rest.delete(`${API_BASE_URL}/api/arts/save/:art_id`, (req, res, ctx) => {
    // Implement logic to remove save from a art
    return res(
      ctx.status(200),
      ctx.json({ message: "Art unsaved successfully" })
    );
  }),

   // Alert a upcoming art
   rest.post(`${API_BASE_URL}/api/arts/alert/:art_id`, (req, res, ctx) => {
    // Implement logic to alert a upcoming art
    return res(
      ctx.status(201),
      ctx.json({ message: "Art alerted successfully" })
    );
  }),

   // Remove alert from a upcoming art
   rest.delete(`${API_BASE_URL}/api/arts/alert/:art_id`, (req, res, ctx) => {
    // Implement logic to remove alert from a upcoming art
    return res(
      ctx.status(200),
      ctx.json({ message: "Art unalerted successfully" })
    );
  }),
];