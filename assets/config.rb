# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = "/assets/"
# sass source
sass_dir = "src"
# home for all generated content
assets = "generated/"
# generated css
css_dir = assets+"css"
# originals
images_dir = "img"
# generated sprites
generated_images_dir = assets + images_dir
generated_images_path = generated_images_dir
http_generated_images_path = http_path + generated_images_dir

# original libraries, plugins, etc.
# will be built to assets or to specific repo
javascripts_dir = "js"

relative_assets = false
# SASS syntax with 2 space indentation
preferred_syntax = :sass

# should pass in '-e production' when compiling for production, else dev in expanded format for ease
output_style = (environment == :production) ? :compressed : :expanded

# To show debugging comments that display the original location of your selectors, set to true
line_comments = (environment == :production) ? false : true