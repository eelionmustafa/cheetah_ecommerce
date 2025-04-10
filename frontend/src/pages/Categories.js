import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const MotionCard = motion(Card);

const Categories = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Categories data with proper images
  const categories = [
    {
      id: 1,
      name: t('categories.electronics'),
      image: '/images/electronics/OIP (2).jpeg',
      description: t('categories.electronicsDesc'),
      category: 'electronics'
    },
    {
      id: 2,
      name: t('categories.accessories'),
      image: '/images/accessories/ICON-accessories.jpeg',
      description: t('categories.accessoriesDesc'),
      category: 'accessories'
    },
    {
      id: 3,
      name: t('categories.homeLiving'),
      image: '/images/house/ICON-house.jpeg',
      description: t('categories.homeLivingDesc'),
      category: 'house'
    },
    {
      id: 4,
      name: t('categories.toysAndGames'),
      image: '/images/toys&games/ICON-toysandgames.jpeg',
      description: t('categories.toysAndGamesDesc'),
      category: 'toys&games'
    },
    {
      id: 5,
      name: t('categories.booksAndSchool'),
      image: '/images/books&school_supplies/ICON-booksandschool.jpeg',
      description: t('categories.booksAndSchoolDesc'),
      category: 'books&school_supplies'
    },
    {
      id: 6,
      name: t('categories.beauty'),
      image: '/images/cosmetics/ICON-cosmetics.jpeg',
      description: t('categories.beautyDesc'),
      category: 'cosmetics'
    },
    {
      id: 7,
      name: t('categories.officeSupplies'),
      image: '/images/office_supplies/ICON-office.jpeg',
      description: t('categories.officeSuppliesDesc'),
      category: 'office_supplies'
    }
  ];

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.category}`);
  };

  const filteredCategories = categories
    .filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h1"
          color="primary"
          gutterBottom
          align="center"
          sx={{ fontFamily: 'Tangerine', mb: 4 }}
        >
          {t('categories.title')}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t('categories.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t('categories.sortBy')}</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label={t('categories.sortBy')}
              >
                <MenuItem value="name">{t('categories.sortByName')}</MenuItem>
                <MenuItem value="popularity">{t('categories.sortByPopularity')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={4}>
          {filteredCategories.map((category) => (
            <Grid item key={category.id} xs={12} sm={6} md={4}>
              <MotionCard
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <CardActionArea onClick={() => handleCategoryClick(category)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image}
                    alt={category.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Categories; 