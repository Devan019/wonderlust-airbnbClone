# Airbnb Clone - WonderLust

## About the Project

WonderLust is a clone of the popular Airbnb platform. It allows users to list their properties, browse available listings, and leave reviews. The project is built using Node.js, Express, MongoDB, and EJS for templating. It also integrates with third-party services like Mapbox for geocoding and Cloudinary for image storage.

## Technologies Used

- Node.js
- Express
- MongoDB
- EJS
- Passport.js (for authentication)
- Mapbox (for geocoding)
- Cloudinary (for image storage)
- Multer (for file uploads)
- Joi (for validation)

## Project Structure

## API Endpoints and Routes

### Authentication Routes

- **GET /auth/google** - Initiate Google OAuth login
- **GET /auth/google/callback** - Google OAuth callback
- **GET /auth/github** - Initiate GitHub OAuth login
- **GET /auth/github/callback** - GitHub OAuth callback

### User Routes

- **GET /signup** - Render signup form
- **POST /signup** - Handle user signup
- **GET /login** - Render login form
- **POST /login** - Handle user login
- **GET /logout** - Handle user logout

### Listing Routes

- **GET /listings** - Get all listings
- **POST /listings** - Create a new listing (requires authentication)
- **GET /listings/new** - Render form to create a new listing (requires authentication)
- **GET /listings/my** - Get listings owned by the current user (requires authentication)
- **GET /listings/:id** - Get a specific listing by ID
- **PATCH /listings/:id** - Update a specific listing by ID (requires authentication)
- **DELETE /listings/:id** - Delete a specific listing by ID (requires authentication)
- **POST /listings/:id/edit** - Handle listing update (requires authentication)

### Review Routes

- **POST /listings/:id/reviews** - Add a review to a listing (requires authentication)
- **DELETE /listings/:id/reviews/:reid** - Delete a review by ID (requires authentication)

## Example Requests

### Create a New Listing

```sh
curl -X POST http://localhost:8080/listings \
  -H "Content-Type: multipart/form-data" \
  -F "title=Cozy Beachfront Cottage" \
  -F "description=Escape to this charming beachfront cottage for a relaxing getaway." \
  -F "price=1500" \
  -F "location=Malibu" \
  -F "country=United States" \
  -F "upload=@/path/to/image.jpg"
