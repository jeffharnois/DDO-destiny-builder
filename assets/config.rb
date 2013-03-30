# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = "/assets/"
# sass source
sass_dir = "assets/src"
# home for http paths
paths = "generated"
# home for all generated content
assets = "public" + http_path + paths
# generated css
css_dir = "public/assets/generated/css"
# originals
images_dir = "assets/img"
# web path
http_images_path = "/" + images_dir
# generated sprites
generated_images_dir = assets + "/img"
generated_images_path = generated_images_dir
http_generated_images_path = http_path + paths + "/img"


relative_assets = false
# SASS syntax with 2 space indentation
preferred_syntax = :sass

# should pass in '-e production' when compiling for production, else dev in expanded format for ease
output_style = (environment == :production) ? :compressed : :expanded

# To show debugging comments that display the original location of your selectors, set to true
line_comments = (environment == :production) ? false : true