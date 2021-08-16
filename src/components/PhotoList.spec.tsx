import axios from 'axios';
import { mocked } from 'ts-jest/utils';
import { Photo } from '../models/Photo';
import {
  screen,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { PhotosList } from './PhotosList';
import user from '@testing-library/user-event';

jest.mock('axios');
const mockedAxios = mocked(axios);
const mockedAxiosGet = mocked(mockedAxios.get);
const mockedAxiosPost = mocked(mockedAxios.post);

describe('PhotoList', () => {
  beforeEach(() => {
    mockedAxiosGet.mockResolvedValue({
      data: [
        {
          id: 1,
          thumbnailUrl: '/photo1.png',
          title: 'Hello World',
          favourite: false,
        },
      ] as Photo[],
    });
  });

  describe('after application fully loads', () => {
    beforeEach(async () => {
      render(<PhotosList />);
      await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
    });

    it('renders the photos', () => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    describe('when clicking in "Refresh" Button', () => {
      beforeEach(async () => {
        user.type(screen.getByLabelText('Your Name:'), 'Bruno');

        mockedAxiosGet.mockReset().mockResolvedValue({
          data: [
            {
              id: 1,
              thumbnailUrl: '/photo1.png',
              title: 'New Loaded Data',
              favourite: false,
            },
          ] as Photo[],
        });
        user.click(screen.getByText('Refresh'));
        await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
      });

      it('performs HTTP call with name="Bruno"', () => {
        expect(mockedAxiosGet).toHaveBeenCalledTimes(1);
        expect(mockedAxiosGet).toHaveBeenCalledWith('/api/photos?name=Bruno');
      });

      it('renders the newly loaded data', () => {
        expect(screen.queryByText('Hello World')).not.toBeInTheDocument();
        expect(screen.getByText('New Loaded Data')).toBeInTheDocument();
      });
    });

    describe('when clicking in "Refresh" Button and server returns error', () => {
      beforeEach(async () => {
        mockedAxiosGet.mockReset().mockRejectedValue({
          response: {
            data: { message: 'Server says sorry!' },
          },
        });
        user.click(screen.getByText('Refresh'));
        await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
      });

      it('renders the error keeping the old data', () => {
        expect(screen.getByText('Hello World')).toBeInTheDocument();
        expect(screen.getByText('Server says sorry!')).toBeInTheDocument();
      });
    });

    describe('when clicking in "Add to Favourites" changes the button text', () => {
      beforeEach(async () => {
        mockedAxiosPost.mockReset().mockResolvedValue({
          data: {
            id: 1,
            thumbnailUrl: '/photo1.png',
            title: 'New Loaded Data',
            favourite: true,
          } as Photo,
        });

        user.click(screen.getByRole('button', { name: 'Add To Favourites' }));
        await waitForElementToBeRemoved(() =>
          screen.getByRole('button', { name: 'Add To Favourites' })
        );
      });

      it('renders "Remove from Favourites"', () => {
        expect(
          screen.getByRole('button', { name: 'Remove from Favourites' })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: 'Add to Favourites' })
        ).not.toBeInTheDocument();
      });
    });
  });
});
