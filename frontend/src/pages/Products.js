import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { addToCart } from '../utils/cartUtils';

const MotionCard = motion(Card);

const Products = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
    productName: ''
  });

  // Products data with proper images and prices in euros
  const products = [
    // Electronics
    {
      id: 1,
      name: "Samsung Smart TV 50\" 4K",
      image: "/images/electronics/televizor-smart-samsung-ue50du8072uxxh-50-led-uhd-4k-yll.avif",
      description: "4K Ultra HD Smart LED TV with HDR",
      price: 599.99,
      category: "electronics"
    },
    {
      id: 2,
      name: "Samsung Galaxy Watch 6",
      image: "/images/electronics/samsung-galaxy-watch-6-classic-bt-43mm-grafit.avif",
      description: "Smart Watch with Health Monitoring",
      price: 299.99,
      category: "electronics"
    },
    {
      id: 3,
      name: "Nintendo Switch OLED",
      image: "/images/electronics/konzole-nintendo-switch-oled-e-bardhe.avif",
      description: "Gaming Console with OLED Display",
      price: 349.99,
      category: "electronics"
    },
    {
      id: 4,
      name: "iPhone 16",
      image: "/images/electronics/apple-iphone-16-61-128gb-ultramarine.avif",
      description: "Latest iPhone with Advanced Camera System",
      price: 999.99,
      category: "electronics"
    },
    {
      id: 5,
      name: "Samsung Monitor 27\"",
      image: "/images/electronics/monitor-samsung-ls27dg302euxen-27-180hz-i-zi.avif",
      description: "27\" Gaming Monitor with 180Hz Refresh Rate",
      price: 299.99,
      category: "electronics"
    },
    {
      id: 6,
      name: "USB Drive 32GB",
      image: '/images/electronics/usb-drive-apacer-ah355--32gb-usb-30-i-zi.avif',
      description: 'High-speed USB 3.0 flash drive',
      price: '19.99',
      category: 'electronics'
    },
    {
      id: 7,
      name: "RGB Gaming Keyboard",
      image: '/images/electronics/tastiere-genesis-rhod-350-rgb-yll.avif',
      description: 'Mechanical gaming keyboard with RGB lighting',
      price: '89.99',
      category: 'electronics'
    },
    {
      id: 8,
      name: "Digital Radio",
      image: '/images/electronics/radio-me-ore-digjitale-camry-cr-1156-e-zezehiri.avif',
      description: 'Portable digital radio with clear sound',
      price: '39.99',
      category: 'electronics'
    },
    {
      id: 9,
      name: "Logitech Gaming Mouse",
      image: '/images/electronics/maus-logitech-g-pro-x-superlight-i-zi-yll-200001060-0.avif',
      description: 'Ultra-lightweight gaming mouse',
      price: '129.99',
      category: 'electronics'
    },
    {
      id: 10,
      name: "Intel Core i5 Processor",
      image: '/images/electronics/intel-core-i5-12600kf-processor-20-mb-smart-cache-box.avif',
      description: 'High-performance processor for gaming and work',
      price: '249.99',
      category: 'electronics'
    },
    // House & Living
    {
      id: 11,
      name: "Modern Sideboard",
      image: "/images/house/sideboard-cabron-fh887411-melamine-in-natural-anthracite--black-metal-legs-142x40x83hcm-mar-200004131-0.avif",
      description: "Contemporary Sideboard with Metal Legs",
      price: 299.99,
      category: "house"
    },
    {
      id: 12,
      name: "Dining Table Set",
      image: "/images/house/set-dining-table-hm11180-5pieces-with-natural-desktop--chairs-in-blue-velvet-mar-200001120-0.avif",
      description: "5-Piece Dining Set with Blue Velvet Chairs",
      price: 599.99,
      category: "house"
    },
    {
      id: 13,
      name: "Two-Seater Sofa",
      image: '/images/house/nextdeco-harold-two-seater-sofa-gray-y87x180x88cm-nxt-200010331-0.avif',
      description: 'Comfortable two-seater sofa in gray',
      price: '449.99',
      category: 'house'
    },
    {
      id: 14,
      name: "Wooden Stool",
      image: "/images/house/nextdeco-stool-made-of-mahogany-wood-h19x15cm-nxt-200010585-0.avif",
      description: "Mahogany Wood Stool",
      price: 49.99,
      category: "house"
    },
    {
      id: 15,
      name: "Wall Mirror",
      image: '/images/house/nextdeco-oval-wall-mirror-gold-metal-frame-50x70cm-nxt-200010855-0.avif',
      description: 'Oval wall mirror with gold frame',
      price: '129.99',
      category: 'house'
    },
    {
      id: 16,
      name: "Metal Console",
      image: '/images/house/nextdeco-metal-console-with-mdf-surface-h80x100x30cm-nxt-200010680-0.avif',
      description: 'Modern metal console with MDF surface',
      price: '199.99',
      category: 'house'
    },
    {
      id: 17,
      name: "Bamboo Shoe Rack",
      image: '/images/house/nextdeco-bamboo-shoe-rack-5-levels-h79x68x23cm-nxt-200010665-0.avif',
      description: '5-level bamboo shoe organizer',
      price: '89.99',
      category: 'house'
    },
    {
      id: 18,
      name: "Bamboo Flower Column",
      image: '/images/house/nextdeco-bamboo-flower-column-with-7-slots-h142x40x20cm-nxt-200010483-0.avif',
      description: 'Decorative bamboo flower display',
      price: '69.99',
      category: 'house'
    },
    {
      id: 19,
      name: "Pine Wood Bed",
      image: '/images/house/bed-gimly-fh67501-solid-pine-wood-in-natural-for-mattress-190x90cm-mar-200005203-0.avif',
      description: 'Natural pine wood bed frame',
      price: '399.99',
      category: 'house'
    },
    // Cosmetics
    {
      id: 20,
      name: "Skin Cleanser",
      image: "/images/cosmetics/skincleanser.webp",
      description: "Gentle Skin Cleansing Solution",
      price: 24.99,
      category: "cosmetics"
    },
    {
      id: 21,
      name: "Makeup Brushes Set",
      image: "/images/cosmetics/makeuBrushes.webp",
      description: "Professional Makeup Brush Set",
      price: 39.99,
      category: "cosmetics"
    },
    {
      id: 22,
      name: "Victoria's Secret Perfume",
      image: "/images/cosmetics/parfumVictorias.webp",
      description: "Luxury Fragrance for Women",
      price: 59.99,
      category: "cosmetics"
    },
    {
      id: 23,
      name: "Lipstick Collection",
      image: '/images/cosmetics/lipsticl22.webp',
      description: 'Set of 6 vibrant lipsticks',
      price: '39.99',
      category: 'cosmetics'
    },
    {
      id: 24,
      name: "Classic Lipstick",
      image: '/images/cosmetics/lipstick.webp',
      description: 'Long-lasting matte lipstick',
      price: '19.99',
      category: 'cosmetics'
    },
    {
      id: 25,
      name: "Luxury Perfume",
      image: '/images/cosmetics/lavielaveuparfume.webp',
      description: 'Premium French perfume',
      price: '129.99',
      category: 'cosmetics'
    },
    {
      id: 26,
      name: "Hair Mask",
      image: '/images/cosmetics/hairmask.webp',
      description: 'Deep conditioning hair treatment',
      price: '24.99',
      category: 'cosmetics'
    },
    {
      id: 27,
      name: "ELF Moisturizer",
      image: '/images/cosmetics/elfmoisturizer.webp',
      description: 'Hydrating face moisturizer',
      price: '14.99',
      category: 'cosmetics'
    },
    {
      id: 28,
      name: "CeraVe Moisturizer",
      image: '/images/cosmetics/ceravemoist.webp',
      description: 'Professional skin moisturizer',
      price: '29.99',
      category: 'cosmetics'
    },
    // Books & School Supplies
    {
      id: 29,
      name: "Spiral Notebook",
      image: "/images/books_school_supplies/spiralnotebook.webp",
      description: "College Ruled Spiral Notebook",
      price: 4.99,
      category: "books_school_supplies"
    },
    {
      id: 30,
      name: "Colored Pencils",
      image: "/images/books_school_supplies/ngjyrapencils.webp",
      description: "24-Pack Professional Colored Pencils",
      price: 12.99,
      category: "books_school_supplies"
    },
    {
      id: 31,
      name: "Tempera Paint Set",
      image: "/images/books_school_supplies/temperapaint.webp",
      description: "12 Colors Tempera Paint Set",
      price: 15.99,
      category: "books_school_supplies"
    },
    {
      id: 32,
      name: "Rulers Set",
      image: '/images/books_school_supplies/rulers.webp',
      description: 'Set of 3 precision rulers',
      price: '12.99',
      category: 'books_school_supplies'
    },
    {
      id: 33,
      name: "Post-it Notes",
      image: '/images/books_school_supplies/postitnotes.webp',
      description: 'Colorful sticky notes pack',
      price: '7.99',
      category: 'books_school_supplies'
    },
    {
      id: 34,
      name: "Erasers Pack",
      image: '/images/books_school_supplies/erasers.webp',
      description: 'Set of 5 high-quality erasers',
      price: '8.99',
      category: 'books_school_supplies'
    },
    {
      id: 35,
      name: "Colored Pens",
      image: '/images/books_school_supplies/coloredPens.webp',
      description: 'Set of 12 colored gel pens',
      price: '11.99',
      category: 'books_school_supplies'
    },
    {
      id: 36,
      name: "Chalk Set",
      image: '/images/books_school_supplies/chalk.webp',
      description: 'Pack of 12 colorful chalk sticks',
      price: '6.99',
      category: 'books_school_supplies'
    },
    // Accessories
    {
      id: 37,
      name: "Calvin Klein Belt",
      image: "/images/accessories/rrip-per-femra-cintura-calvin-klein-jeans-e-zeze-yl.avif",
      description: "Women's Fashion Belt",
      price: 49.99,
      category: "accessories"
    },
    {
      id: 38,
      name: "Nike Waistpack",
      image: '/images/accessories/nike-heritage-waistpack-db04.avif',
      description: 'Sporty waistpack for active lifestyle',
      price: '39.99',
      category: 'accessories'
    },
    {
      id: 39,
      name: "Designer Necklace",
      image: '/images/accessories/necklace.jpeg',
      description: 'Elegant designer necklace',
      price: '89.99',
      category: 'accessories'
    },
    {
      id: 40,
      name: "Armani Exchange Bag",
      image: '/images/accessories/rrip-lekure-per-meshkuj-armani-exchange-i.avif',
      description: 'Luxury leather bag for men',
      price: '199.99',
      category: 'accessories'
    },
    {
      id: 41,
      name: "MLB Yankees Cap",
      image: '/images/accessories/kapele-per-meshkuj-47-brand-mlb-new-york-yankees.avif',
      description: 'Official MLB Yankees baseball cap',
      price: '34.99',
      category: 'accessories'
    },
    {
      id: 42,
      name: "Blue Earrings",
      image: '/images/accessories/earrings-blue.jpg',
      description: 'Elegant blue crystal earrings',
      price: '29.99',
      category: 'accessories'
    },
    {
      id: 43,
      name: "Keychain",
      image: '/images/accessories/beige-black-ring-metal-steel-branded-logo-keyring-keychain-gtw-200003642-0.avif',
      description: 'Stylish metal keychain',
      price: '14.99',
      category: 'accessories'
    },
    // Toys & Games
    {
      id: 44,
      name: "Board Game Collection",
      image: "/images/toys_games/ICON-toysandgames.jpeg",
      description: "Family Board Game Set",
      price: 29.99,
      category: "toys_games"
    },
    {
      id: 45,
      name: "Xbox Console",
      image: '/images/toys_games/xbox.webp',
      description: 'Latest Xbox gaming console',
      price: '499.99',
      category: 'toys_games'
    },
    {
      id: 46,
      name: "Rubik's Cube",
      image: '/images/toys_games/rubix.webp',
      description: 'Classic Rubik\'s cube puzzle',
      price: '14.99',
      category: 'toys_games'
    },
    {
      id: 47,
      name: "LEGO Set",
      image: '/images/toys_games/legos.jpg',
      description: 'Creative LEGO building set',
      price: '79.99',
      category: 'toys_games'
    },
    {
      id: 48,
      name: "PlayStation 5",
      image: '/images/toys_games/ps5.webp',
      description: 'Next-gen gaming console',
      price: '499.99',
      category: 'toys_games'
    },
    {
      id: 49,
      name: "Plush Toy",
      image: '/images/toys_games/plush.webp',
      description: 'Soft and cuddly plush toy',
      price: '24.99',
      category: 'toys_games'
    },
    {
      id: 50,
      name: "Pokemon Building Blocks",
      image: '/images/toys_games/picachublock.webp',
      description: 'Pikachu themed building blocks',
      price: '29.99',
      category: 'toys_games'
    },
    {
      id: 51,
      name: "Nintendo Console",
      image: '/images/toys_games/nintendo.webp',
      description: 'Classic Nintendo gaming system',
      price: '199.99',
      category: 'toys_games'
    },
    {
      id: 52,
      name: "Monopoly Board Game",
      image: '/images/toys_games/monopoly.jpeg',
      description: 'Classic family board game',
      price: '39.99',
      category: 'toys_games'
    },
    {
      id: 53,
      name: "Minecraft Toys",
      image: '/images/toys_games/minecraftoys.webp',
      description: 'Minecraft themed action figures',
      price: '19.99',
      category: 'toys_games'
    },
    {
      id: 54,
      name: "Hot Wheels Truck",
      image: '/images/toys_games/hotwheelstruck.webp',
      description: 'Remote control monster truck',
      price: '34.99',
      category: 'toys_games'
    },
    {
      id: 55,
      name: "Hot Wheels Set",
      image: '/images/toys_games/hotwheels.webp',
      description: 'Collection of 5 Hot Wheels cars',
      price: '24.99',
      category: 'toys_games'
    },
    {
      id: 56,
      name: "Harry Potter Owl",
      image: '/images/toys_games/harrypotterOwl.webp',
      description: 'Hedwig plush toy from Harry Potter',
      price: '19.99',
      category: 'toys_games'
    },
    // Office Supplies
    {
      id: 57,
      name: "Professional Pen Set",
      image: "/images/office_supplies/ICON-office.jpeg",
      description: "12-Pack Professional Ballpoint Pens",
      price: 19.99,
      category: "office_supplies"
    },
    {
      id: 58,
      name: "Professional Desk",
      image: '/images/office_supplies/zyre-profesionale-fh204501-150x80x75-e-kafte-yll-200007336-0.avif',
      description: 'Ergonomic office desk',
      price: '299.99',
      category: 'office_supplies'
    },
    {
      id: 59,
      name: "Desk Lamp",
      image: '/images/office_supplies/llamptavoline.webp',
      description: 'Modern desk lamp with adjustable brightness',
      price: '49.99',
      category: 'office_supplies'
    },
    {
      id: 60,
      name: "Ergonomic Chair",
      image: '/images/office_supplies/karrikeergonomice.webp',
      description: 'Comfortable ergonomic office chair',
      price: '199.99',
      category: 'office_supplies'
    },
    {
      id: 61,
      name: "Tray Stand",
      image: '/images/office_supplies/traystand.webp',
      description: 'Organizer tray stand for desk',
      price: '29.99',
      category: 'office_supplies'
    },
    {
      id: 62,
      name: "Stapler",
      image: '/images/office_supplies/stapler.webp',
      description: 'Heavy-duty office stapler',
      price: '12.99',
      category: 'office_supplies'
    },
    {
      id: 62,
      name: 'Stickers Pack',
      image: '/images/office_supplies/shtiker.webp',
      description: 'Assorted office stickers',
      price: '8.99',
      category: 'office_supplies'
    },
    {
      id: 63,
      name: 'Push Pins',
      image: '/images/office_supplies/pushimoreperkemb.webp',
      description: 'Colorful push pins for bulletin board',
      price: '6.99',
      category: 'office_supplies'
    },
    {
      id: 64,
      name: 'Office Desk',
      image: '/images/office_supplies/professional-office-melamine-fh2351-natural-dark-grey-150x60x88cm-mar-200005818-0.avif',
      description: 'Professional melamine office desk',
      price: '249.99',
      category: 'office_supplies'
    },
    {
      id: 65,
      name: 'Keyboard Desk',
      image: '/images/office_supplies/keyboarddesk.webp',
      description: 'Ergonomic keyboard tray',
      price: '39.99',
      category: 'office_supplies'
    },
    {
      id: 66,
      name: 'Spine Support',
      image: '/images/office_supplies/jastekpershpine.webp',
      description: 'Ergonomic spine support cushion',
      price: '24.99',
      category: 'office_supplies'
    }
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    
    // Dispatch custom event to update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));
    
    setSnackbar({
      open: true,
      message: t('home.addedToCart'),
      severity: 'success',
      productName: product.name
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const currentCategory = searchParams.get('category');

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !currentCategory || product.category === currentCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'price') {
        return parseFloat(a.price) - parseFloat(b.price);
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
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/" color="inherit">
            {t('home.welcome')}
          </Link>
          {currentCategory && (
            <Link component={RouterLink} to="/categories" color="inherit">
              {t('categories.title')}
            </Link>
          )}
          <Typography color="text.primary">{t('products.title')}</Typography>
        </Breadcrumbs>

        <Typography
          variant="h1"
          color="primary"
          gutterBottom
          align="center"
          sx={{ fontFamily: 'Tangerine', mb: 4 }}
        >
          {currentCategory ? t(`categories.${currentCategory}`) : t('products.title')}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t('products.searchPlaceholder')}
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
              <InputLabel>{t('products.sortBy')}</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label={t('products.sortBy')}
              >
                <MenuItem value="name">{t('products.sortByName')}</MenuItem>
                <MenuItem value="price">{t('products.sortByPrice')}</MenuItem>
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
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <MotionCard
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      objectFit: "contain",
                      backgroundColor: "#f5f5f5",
                      padding: "16px",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)"
                      }
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      €{product.price}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions sx={{ justifyContent: 'center', p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(product)}
                    sx={{
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                      }
                    }}
                  >
                    {t('home.addToCart')}
                  </Button>
                </CardActions>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 2 }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Products;
