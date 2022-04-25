package bit.project.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import javax.persistence.*;
import javax.persistence.Id;
import java.time.LocalDateTime;
import java.util.List;

import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Productsubcategory{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private LocalDateTime tocreation;


    @ManyToOne
    private Productcategory productcategory;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "productsubcategory")
    private List<Product> productsubcategoryProductList;


    public Productsubcategory(Integer id){
        this.id = id;
    }

    public Productsubcategory(Integer id, String code, String name){
        this.id = id;
        this.code = code;
        this.name = name;
    }

}
