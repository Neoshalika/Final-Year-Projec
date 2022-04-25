package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.entity.Productsubcategory;
import bit.project.server.dao.ProductsubcategoryDao;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/productsubcategories")
public class ProductsubcategoryController{

    @Autowired
    private ProductsubcategoryDao productsubcategoryDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ProductsubcategoryController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("productsubcategory");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("PS");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Productsubcategory> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all productsubcategories", UsecaseList.SHOW_ALL_PRODUCTSUBCATEGORIES);

        if(pageQuery.isEmptySearch()){
            return productsubcategoryDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer productcategoryId = pageQuery.getSearchParamAsInteger("productcategory");

        List<Productsubcategory> productsubcategories = productsubcategoryDao.findAll(DEFAULT_SORT);
        Stream<Productsubcategory> stream = productsubcategories.parallelStream();

        List<Productsubcategory> filteredProductsubcategories = stream.filter(productsubcategory -> {
            if(code!=null)
                if(!productsubcategory.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(productcategoryId!=null)
                if(!productsubcategory.getProductcategory().getId().equals(productcategoryId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredProductsubcategories, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Productsubcategory> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all productsubcategories' basic data", UsecaseList.SHOW_ALL_PRODUCTSUBCATEGORIES);
        return productsubcategoryDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Productsubcategory get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get productsubcategory", UsecaseList.SHOW_PRODUCTSUBCATEGORY_DETAILS);
        Optional<Productsubcategory> optionalProductsubcategory = productsubcategoryDao.findById(id);
        if(optionalProductsubcategory.isEmpty()) throw new ObjectNotFoundException("Productsubcategory not found");
        return optionalProductsubcategory.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete productsubcategories", UsecaseList.DELETE_PRODUCTSUBCATEGORY);

        try{
            if(productsubcategoryDao.existsById(id)) productsubcategoryDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this productsubcategory already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Productsubcategory productsubcategory, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new productsubcategory", UsecaseList.ADD_PRODUCTSUBCATEGORY);

        productsubcategory.setTocreation(LocalDateTime.now());
        productsubcategory.setCreator(authUser);
        productsubcategory.setId(null);


        EntityValidator.validate(productsubcategory);

        PersistHelper.save(()->{
            productsubcategory.setCode(codeGenerator.getNextId(codeConfig));
            return productsubcategoryDao.save(productsubcategory);
        });

        return new ResourceLink(productsubcategory.getId(), "/productsubcategories/"+productsubcategory.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Productsubcategory productsubcategory, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update productsubcategory details", UsecaseList.UPDATE_PRODUCTSUBCATEGORY);

        Optional<Productsubcategory> optionalProductsubcategory = productsubcategoryDao.findById(id);
        if(optionalProductsubcategory.isEmpty()) throw new ObjectNotFoundException("Productsubcategory not found");
        Productsubcategory oldProductsubcategory = optionalProductsubcategory.get();

        productsubcategory.setId(id);
        productsubcategory.setCode(oldProductsubcategory.getCode());
        productsubcategory.setCreator(oldProductsubcategory.getCreator());
        productsubcategory.setTocreation(oldProductsubcategory.getTocreation());


        EntityValidator.validate(productsubcategory);

        productsubcategory = productsubcategoryDao.save(productsubcategory);
        return new ResourceLink(productsubcategory.getId(), "/productsubcategories/"+productsubcategory.getId());
    }

    @GetMapping("/bysubcat/{id}")
    public List<Productsubcategory> getAllByCategory(@PathVariable Integer id, PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all productsubcategories' basic data", UsecaseList.SHOW_ALL_PRODUCTSUBCATEGORIES);
        return productsubcategoryDao.findAllByCategory(id);
    }

}
