import React, { useState, useCallback } from 'react';
import { debounce, DebouncedFunc } from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { wordpressApi } from '@/infrastructure/wordpress/api';
import { queryKeys } from '@/lib/queryKeyFactory';
import { TWordPressPost } from '@/domain/types';
import {
  TextField,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Skeleton
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

interface WordPressPostsSearchProps {
  onPostSelect?: (post: TWordPressPost) => void;
  onCancel?: () => void;
}

const WordPressPostsSearch: React.FC<WordPressPostsSearchProps> = ({
  onPostSelect,
  onCancel
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedPostType, setSelectedPostType] = useState<string>('');

  // Fetch available post types
  const { data: postTypes, isLoading: isLoadingPostTypes } = useQuery({
    queryKey: queryKeys.wordpress.postTypes,
    queryFn: () => wordpressApi.fetchPostTypes(),
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });

  // Set default post type when postTypes are loaded
  React.useEffect(() => {
    if (postTypes && postTypes.length > 0 && !selectedPostType) {
      // Prefer 'posts' if available, otherwise use the first one
      const defaultType = postTypes.find(t => t.restBase === 'posts') || postTypes[0];
      setSelectedPostType(defaultType.restBase);
    }
  }, [postTypes, selectedPostType]);

  const { data: posts, isPending, error } = useQuery({
    queryKey: queryKeys.wordpress.posts(debouncedSearchQuery, selectedPostType),
    queryFn: () => wordpressApi.fetchPosts(debouncedSearchQuery, selectedPostType),
    retry: false,
    enabled: !!selectedPostType
  });

  const debouncedSetSearchQuery: DebouncedFunc<(value: string) => void> = useCallback(
    debounce((value: string) => {
      setDebouncedSearchQuery(value);
    }, 150),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    debouncedSetSearchQuery(value);
  };

  const handlePostTypeChange = (event: any) => {
    setSelectedPostType(event.target.value as string);
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{
        display: 'flex',
        gap: 2,
        mb: 2,
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        pb: 2
      }}>
        <Button
          size="small"
          onClick={onCancel}
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <FormControl fullWidth size="small">
          <InputLabel sx={{ fontSize: '0.8125rem' }}>Post Type</InputLabel>
          <Select
            value={selectedPostType}
            label="Post Type"
            onChange={handlePostTypeChange}
            disabled={isLoadingPostTypes}
            sx={{ fontSize: '0.8125rem' }}
          >
            {isLoadingPostTypes ? (
              <MenuItem value="">Loading...</MenuItem>
            ) : (
              postTypes?.map((type) => (
                <MenuItem key={type.restBase} value={type.restBase}>
                  {type.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Box>

      <TextField
        fullWidth
        size="small"
        placeholder="Search posts..."
        value={localSearchQuery}
        onChange={handleSearchChange}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            fontSize: '0.875rem',
            '& fieldset': {
              borderColor: 'grey.300',
            },
            '&:hover fieldset': {
              borderColor: 'grey.400',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: 1,
            },
          },
        }}
      />

      {isPending ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.5, p: 1 }}>
              <Skeleton variant="rounded" width={56} height={56} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
            </Box>
          ))}
        </Box>
      ) : error ? (
        <Typography color="error" variant="body2">Error: {error.message}</Typography>
      ) : posts && posts.length > 0 ? (
        <Box sx={{
          maxHeight: 'calc(100vh - 280px)',
          overflow: 'auto',
          mx: -2,
          px: 2
        }}>
          {posts.map((post: TWordPressPost) => (
            <Card
              key={post.wordpressId}
              variant="outlined"
              sx={{
                mb: 1.5,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'grey.200',
                boxShadow: 'none',
                transition: 'all 0.15s ease-in-out',
                '&:hover': {
                  borderColor: 'grey.300',
                  bgcolor: 'grey.50',
                }
              }}
              onClick={() => onPostSelect?.({
                ...post,
                excerpt: post.excerpt || '',
                image: post.image || '',
              })}
            >
              <CardContent sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                '&:last-child': { pb: 1.5 }
              }}>
                <Avatar
                  src={post.image}
                  alt={post.title}
                  variant="rounded"
                  sx={{
                    width: 56,
                    height: 56,
                    mr: 1.5,
                    bgcolor: 'grey.100',
                    flexShrink: 0
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    lineHeight: 1.35,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center', py: 4 }}>
          No posts found
        </Typography>
      )}
    </Box>
  );
};

export default WordPressPostsSearch;