import { OutputVideoType, Resolutions } from '../types/videos';

export type DBType = {
  videos: OutputVideoType[];
};

export const db: DBType = {
  videos: [
    {
      id: 1,
      title: 'Introduction to TypeScript',
      author: 'John Doe',
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: '2025-01-15T10:00:00.000Z',
      publicationDate: '2025-01-20T10:00:00.000Z',
      availableResolutions: [Resolutions.P480, Resolutions.P720, Resolutions.P1080]
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      author: 'Jane Smith',
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: '2025-01-10T14:30:00.000Z',
      publicationDate: '2025-01-18T09:00:00.000Z',
      availableResolutions: [Resolutions.P360, Resolutions.P720, Resolutions.P1080, Resolutions.P1440]
    },
    {
      id: 3,
      title: 'Building REST APIs with Express',
      author: 'Mike Johnson',
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: '2025-01-05T08:15:00.000Z',
      publicationDate: '2025-01-12T12:00:00.000Z',
      availableResolutions: [Resolutions.P240, Resolutions.P480, Resolutions.P720]
    },
    {
      id: 4,
      title: 'Database Design Fundamentals',
      author: 'Sarah Williams',
      canBeDownloaded: true,
      minAgeRestriction: 13,
      createdAt: '2025-01-08T16:45:00.000Z',
      publicationDate: '2025-01-15T10:30:00.000Z',
      availableResolutions: [Resolutions.P720, Resolutions.P1080]
    },
    {
      id: 5,
      title: 'Modern JavaScript ES6+',
      author: 'David Brown',
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: '2025-01-12T11:20:00.000Z',
      publicationDate: '2025-01-25T15:00:00.000Z',
      availableResolutions: null
    },
    {
      id: 6,
      title: 'Docker Containerization Guide',
      author: 'Emily Davis',
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: '2025-01-20T09:00:00.000Z',
      publicationDate: '2025-01-28T14:00:00.000Z',
      availableResolutions: [Resolutions.P144, Resolutions.P360, Resolutions.P480, Resolutions.P720, Resolutions.P1080, Resolutions.P2160]
    },
    {
      id: 7,
      title: 'GraphQL vs REST',
      author: 'Robert Taylor',
      canBeDownloaded: true,
      minAgeRestriction: 16,
      createdAt: '2025-01-18T13:10:00.000Z',
      publicationDate: '2025-01-22T11:00:00.000Z',
      availableResolutions: [Resolutions.P480, Resolutions.P1080]
    }
  ]
}
