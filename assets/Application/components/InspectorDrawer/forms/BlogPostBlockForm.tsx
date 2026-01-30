import React, { useState, useEffect } from 'react';
import { BlogPostBlockPropsType, BlogPostBlockPropsSchema } from '@/Domain/Blocks/block-post';
import { z } from 'zod';
import { Typography, Divider, Button } from '@mui/material';
import { Stack } from '@mui/material';
import ImageBlockForm from './ImageBlockForm';
import HeadingBlockForm from './HeadingBlockForm';
import TextBlockForm from './TextBlockForm';
import ButtonBlockForm from './ButtonBlockForm';
import SidebarAccordion from './components/SidebarAccordion';
import WordPressPostsSearch from './inputs/WordPressPostSearch';
import SearchIcon from '@mui/icons-material/Search';
import { TWordPressPost } from '@/Domain/types';

type BlogPostBlockFormProps = {
  data: BlogPostBlockPropsType;
  setData: (v: BlogPostBlockPropsType) => void;
};

export default function BlogPostBlockForm({ data, setData }: BlogPostBlockFormProps) {
  const [errors, setErrors] = useState<z.ZodError | null>(null);
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);
  const [hiddenPanels, setHiddenPanels] = useState<Set<string>>(() => {
    const initialHidden = new Set<string>();
    data.components.forEach((component, index) => {
      if (component.data.hidden) {
        initialHidden.add(`component-${index}`);
      }
    });
    return initialHidden;
  });
  const [isSearching, setIsSearching] = useState(false);

  // Synchronize hiddenPanels when data.components changes
  useEffect(() => {
    const newHiddenPanels = new Set<string>();
    data.components.forEach((component, index) => {
      if (component.data.hidden) {
        newHiddenPanels.add(`component-${index}`);
      }
    });
    setHiddenPanels(newHiddenPanels);

    // If the currently expanded panel is now hidden, collapse it and expand the first visible panel
    if (expandedPanel && newHiddenPanels.has(expandedPanel)) {
      // Find the first visible panel
      const firstVisible = data.components.find((_, index) => !newHiddenPanels.has(`component-${index}`));
      setExpandedPanel(firstVisible ? `component-${data.components.indexOf(firstVisible)}` : false);
    }
  }, [data.components, expandedPanel]);

  const updateData = (updates: Partial<BlogPostBlockPropsType>) => {
    const newData = { ...data, ...updates };
    const result = BlogPostBlockPropsSchema.safeParse(newData);
    
    if (result.success) {
      setData(result.data);
      setErrors(null);
    } else {
      setErrors(result.error);
    }
  };

  const updateComponent = (index: number, componentData: any) => {
    const newComponents = [...data.components];
    newComponents[index] = {
      ...newComponents[index],
      data: componentData,
    };
    
    updateData({ components: newComponents });
  };

  const handleToggleHidden = (panelId: string) => (event: React.MouseEvent) => {
    event.stopPropagation();
    const index = parseInt(panelId.split('-')[1]);
    
    const component = data.components[index];
    const newComponentData = {
      ...component.data,
      hidden: !component.data.hidden,
    };

    updateComponent(index, newComponentData);

    setHiddenPanels(prev => {
      const newSet = new Set(prev);
      if (newComponentData.hidden) {
        newSet.add(panelId);
        // If the panel being hidden is currently expanded, collapse it
        if (expandedPanel === panelId) {
          setExpandedPanel(false);
        }
      } else {
        newSet.delete(panelId);
        // Optionally, expand this panel when it's made visible
        setExpandedPanel(panelId);
      }
      return newSet;
    });
  };

  const renderComponentPanel = (component: any, index: number) => {
    const panelId = `component-${index}`;
    const componentTitle = `${component.type} Block`;

    const sharedProps = {
      data: component.data,
      setData: (newData: any) => updateComponent(index, newData),
    };

    const getPanelContent = () => {
      switch (component.type) {
        case 'Image':
          return <Stack spacing={2}><ImageBlockForm {...sharedProps} /></Stack>;
        case 'Heading':
          return <Stack spacing={2}><HeadingBlockForm {...sharedProps} /></Stack>;
        case 'Text':
          return <Stack spacing={2}><TextBlockForm {...sharedProps} /></Stack>;
        case 'Button':
          return <Stack spacing={2}><ButtonBlockForm {...sharedProps} /></Stack>;
        default:
          return null;
      }
    };

    return (
      <SidebarAccordion
        key={panelId}
        id={panelId}
        title={componentTitle}
        isHidden={hiddenPanels.has(panelId)}
        onToggleHidden={handleToggleHidden(panelId)}
        expanded={expandedPanel === panelId}
        onChange={() => setExpandedPanel(expandedPanel === panelId ? false : panelId)}
      >
        {getPanelContent()}
      </SidebarAccordion>
    );
  };

  const handlePostSelect = (post: TWordPressPost) => {
    const newComponents = data.components.map((component) => {
      let isHidden = false;

      switch (component.type) {
        case 'Image':
          isHidden = !post.image;
          return {
            ...component,
            data: {
              ...component.data,
              image: {
                ...component.data.image,
                url: post.image || component.data.image.url,
                alt: post.title || component.data.image.alt
              },
              hidden: isHidden
            }
          };
        case 'Heading':
          isHidden = !post.title;
          return {
            ...component,
            data: {
              ...component.data,
              content: post.title || component.data.content,
              hidden: isHidden
            }
          };
        case 'Text':
          isHidden = !post.excerpt;
          return {
            ...component,
            data: {
              ...component.data,
              content: post.excerpt || component.data.content,
              hidden: isHidden
            }
          };
        case 'Button':
          isHidden = !post.permalink;
          return {
            ...component,
            data: {
              ...component.data,
              content: 'Read More',
              button: {
                ...component.data.button,
                url: post.permalink || component.data.button.url,
                hidden: isHidden
              }
            }
          };
        default:
          return component;
      }
    });

    updateData({
      wordpressId: post.wordpressId,
      postType: post.postType,
      components: newComponents
          });

    setIsSearching(false);
  };

  if (isSearching) {
    return (
      <WordPressPostsSearch
        onPostSelect={handlePostSelect}
        onCancel={() => setIsSearching(false)}
      />
    );
  }

  return (
    <>
        <Button
          variant="contained"
          size="small"
          onClick={() => setIsSearching(true)}
          startIcon={<SearchIcon />}
        >
          Search Posts
        </Button>

      <Divider />

      <Typography variant="subtitle2" gutterBottom>Content Blocks</Typography>
      
      {data.components.map((component, index) => 
        renderComponentPanel(component, index)
      )}
    </>
  );
}