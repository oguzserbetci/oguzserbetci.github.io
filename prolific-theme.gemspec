# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "prolific-theme"
  spec.version       = "0.1.0"
  spec.authors       = ["Oguz Serbetci"]
  spec.email         = ["oguz.serbetci@gmail.com"]

  spec.summary       = "A jekyll template for profilic blogs."
  spec.homepage      = "https://github.com/oguzserbetci/profilic"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README)!i) }

  spec.add_runtime_dependency "jekyll", "~> 3.8"
  spec.add_runtime_dependency "jekyll-feed"

  spec.add_development_dependency "bundler", "~> 2.0"
  spec.add_development_dependency "rake", "~> 12.0"
end
